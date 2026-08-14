# HealthSync — Doctor Location Discovery Flow

## 1. Current Database Design

The current HealthSync design has four important entities:

```text
Doctor
  |
  +---- ManyToMany ---- Clinic
  |
  +---- ManyToMany ---- Hospital
  |
  +---- OneToMany ----- DoctorsAvailability
                              |
                              +---- ManyToOne ---- Clinic
                              |
                              +---- ManyToOne ---- Hospital
```

The physical location belongs to the **Clinic/Hospital**:

```text
Clinic
  ├── address
  ├── latitude
  └── longitude

Hospital
  ├── address
  ├── latitude
  └── longitude
```

The doctor's location-specific availability belongs to `DoctorsAvailability`:

```text
DoctorsAvailability
  ├── doctor
  ├── clinic OR hospital
  ├── weekday
  ├── startTime
  ├── endTime
  └── slotDuration
```

Therefore, the doctor does **not** need latitude/longitude in the `Doctor` table.

---

# 2. Entity Relationship Diagram

```mermaid
erDiagram
    DOCTOR }o--o{ CLINIC : works_at
    DOCTOR }o--o{ HOSPITAL : works_at

    DOCTOR ||--o{ DOCTORS_AVAILABILITY : has

    CLINIC ||--o{ DOCTORS_AVAILABILITY : provides
    HOSPITAL ||--o{ DOCTORS_AVAILABILITY : provides

    DOCTOR {
        uuid id PK
        string specialization
        int experience
        string license_number
        int appointment_fee
    }

    CLINIC {
        uuid id PK
        string name
        string address
        string phone
        decimal latitude
        decimal longitude
    }

    HOSPITAL {
        uuid id PK
        string name
        string address
        string phone
        decimal latitude
        decimal longitude
    }

    DOCTORS_AVAILABILITY {
        uuid id PK
        uuid doctor_id FK
        uuid clinic_id FK
        uuid hospital_id FK
        string weekday
        time start_time
        time end_time
        int slot_duration
    }
```

---

# 3. Meaning of Each Relationship

## Doctor → Clinic

```text
Doctor MANY ↔ MANY Clinic
```

A doctor can work at multiple clinics, and a clinic can have multiple doctors.

Example:

```text
Dr. Rahul
 ├── City Clinic
 └── Heart Care Clinic

City Clinic
 ├── Dr. Rahul
 ├── Dr. Amit
 └── Dr. Priya
```

This is correctly represented using `ManyToMany`.

---

## Doctor → Hospital

```text
Doctor MANY ↔ MANY Hospital
```

A doctor can work at multiple hospitals, and a hospital can have multiple doctors.

Example:

```text
Dr. Rahul
 ├── Apollo Hospital
 └── Medanta Hospital

Apollo Hospital
 ├── Dr. Rahul
 ├── Dr. Amit
 └── Dr. Priya
```

---

## Doctor → DoctorsAvailability

```text
Doctor 1 → MANY DoctorsAvailability
```

One doctor can have many schedules.

Example:

```text
Dr. Rahul

Availability #1
Monday
Apollo Hospital
09:00 - 13:00

Availability #2
Tuesday
City Clinic
16:00 - 20:00

Availability #3
Wednesday
Apollo Hospital
09:00 - 13:00
```

---

# 4. Why DoctorsAvailability Contains Clinic/Hospital

`DoctorsAvailability` is the important entity for the location-based scheduling requirement.

It answers:

> "Where is this doctor available, and when?"

For example:

```text
DoctorsAvailability
----------------------------
doctor       = Dr. Rahul
hospital     = Apollo
clinic       = null
weekday      = Monday
startTime    = 09:00
endTime      = 13:00
slotDuration = 15
```

Another record:

```text
DoctorsAvailability
----------------------------
doctor       = Dr. Rahul
hospital     = null
clinic       = City Clinic
weekday      = Tuesday
startTime    = 16:00
endTime      = 20:00
slotDuration = 15
```

This allows the same doctor to have different schedules at different facilities.

---

# 5. Physical Location

The physical location is stored only once.

```mermaid
flowchart LR
    D[Doctor] --> A[DoctorsAvailability]

    A --> C[Clinic]
    A --> H[Hospital]

    C --> CLOC[Latitude + Longitude]
    H --> HLOC[Latitude + Longitude]
```

For example:

```text
Clinic:
City Clinic
latitude  = 23.3600
longitude = 85.3150
```

Every doctor associated with that clinic automatically uses those coordinates.

You should **not** duplicate:

```text
doctor.latitude
doctor.longitude
```

because a doctor can have multiple locations.

---

# 6. Doctor Adds a Location

The doctor does not directly enter a latitude/longitude for themselves.

Instead:

```mermaid
sequenceDiagram
    participant D as Doctor
    participant FE as Next.js
    participant API as NestJS
    participant DB as PostgreSQL

    D->>FE: Select Clinic/Hospital
    FE->>API: Request facility details
    API->>DB: Get Clinic/Hospital
    DB-->>API: Name + Address + Latitude + Longitude
    API-->>FE: Facility details

    D->>FE: Select weekday and time
    FE->>API: Create DoctorsAvailability
    API->>DB: Save doctor_id + clinic/hospital + schedule

    DB-->>API: Availability created
    API-->>FE: Success
```

The doctor therefore creates a **schedule at a facility**, not a new physical location.

---

# 7. Doctor Location Selection with Google Maps

If the doctor is creating a new clinic/hospital, Google Maps can be used to select the facility's physical location.

```mermaid
flowchart TD
    A[Doctor/Admin creates facility] --> B[Open Google Maps]
    B --> C[Search facility or move marker]
    C --> D[Select exact location]
    D --> E[Latitude + Longitude]
    E --> F[Save Clinic/Hospital]
```

After the facility has been created:

```text
Clinic
 ├── name
 ├── address
 ├── latitude
 └── longitude
```

Doctors simply select that existing facility.

---

# 8. Patient "Find Nearby Doctors" Flow

The complete patient flow is:

```mermaid
flowchart TD
    A[Patient opens Find Doctors] --> B[Get Patient GPS]

    B --> C{Location permission granted?}

    C -->|Yes| D[Patient Latitude + Longitude]
    C -->|No| E[Ask patient to select/search location]

    E --> D

    D --> F[Apply Filters]

    F --> G[Find nearby Clinics/Hospitals]

    G --> H[Find DoctorsAvailability at nearby facilities]

    H --> I[Get Doctor information]

    I --> J[Get Current Date and Time]

    J --> K[Check Doctor's Availability]

    K --> L{Currently available?}

    L -->|Yes| M[GREEN Marker]
    L -->|No| N[RED Marker]

    N --> O[Find Next Availability]

    O --> P[Show Next Visit Time]

    M --> Q[Return Map Results]
    P --> Q

    Q --> R[Google Maps UI]
```

---

# 9. How Nearby Search Works

Suppose the patient is at:

```text
latitude  = 23.3441
longitude = 85.3240
```

The backend searches nearby:

```text
Clinics
+
Hospitals
```

using their latitude/longitude.

For example:

```text
Patient
23.3441, 85.3240

Nearby:

Apollo Hospital
23.3500, 85.3200
1.2 km

City Clinic
23.3600, 85.3150
2.4 km

Dental Care
23.3900, 85.3000
6.1 km
```

The backend then finds doctors available at those facilities.

---

# 10. Complete Search Architecture

```mermaid
flowchart LR
    P[Patient GPS] --> API[NestJS Nearby Doctors API]

    API --> GEO[Find Nearby Facilities]

    GEO --> C[(Clinics)]
    GEO --> H[(Hospitals)]

    C --> A[(DoctorsAvailability)]
    H --> A

    A --> D[(Doctors)]

    D --> FILTER[Apply Doctor Filters]

    FILTER --> S[Check Schedule]

    S --> RESULT[Doctor Location Results]

    RESULT --> FE[Next.js]

    FE --> MAP[Google Maps]
```

---

# 11. Filtering

The patient can filter by:

### Doctor name

```text
doctorName = Rahul
```

### Specialization

```text
specialization = Cardiology
```

### Clinic

```text
clinicName = City Clinic
```

### Hospital

```text
hospitalName = Apollo Hospital
```

Filters are applied after/alongside the nearby facility search.

```mermaid
flowchart TD
    A[Patient GPS] --> B[Nearby Facilities]

    B --> C[DoctorsAvailability]

    C --> D[Doctors]

    D --> E{Doctor Name Filter}
    E -->|Match| F[Continue]
    E -->|No Filter| F

    F --> G{Specialization Filter}
    G -->|Match| H[Continue]
    G -->|No Filter| H

    H --> I{Clinic/Hospital Filter}
    I -->|Match| J[Continue]
    I -->|No Filter| J

    J --> K[Final Results]
```

---

# 12. Green Marker — Doctor Currently Available

Example:

```text
Current time:
Wednesday 10:30 AM

DoctorsAvailability:

Doctor: Rahul
Hospital: Apollo
Wednesday
09:00 - 13:00
```

Because:

```text
09:00 <= 10:30 <= 13:00
```

the doctor is currently available.

Response:

```json
{
  "doctorId": "D1",
  "doctorName": "Dr. Rahul",
  "specialization": "Cardiology",
  "facilityType": "hospital",
  "facilityName": "Apollo Hospital",
  "latitude": 23.3500,
  "longitude": 85.3200,
  "status": "PRESENT",
  "nextVisit": null
}
```

Map:

```text
🟢 Dr. Rahul
Apollo Hospital
Available now
1.2 km
```

---

# 13. Red Marker — Doctor Visits Later

Suppose:

```text
Current time:
Thursday 10:30 AM
```

but the doctor has:

```text
Wednesday 09:00 - 13:00
Friday    16:00 - 20:00
```

The doctor is associated with the facility, but is not currently available.

Response:

```json
{
  "doctorId": "D1",
  "doctorName": "Dr. Rahul",
  "facilityName": "Apollo Hospital",
  "latitude": 23.3500,
  "longitude": 85.3200,
  "status": "NOT_PRESENT",
  "nextVisit": {
    "weekday": "Friday",
    "startTime": "16:00",
    "endTime": "20:00"
  }
}
```

Map:

```text
🔴 Dr. Rahul
Apollo Hospital

Next visit:
Friday
4:00 PM - 8:00 PM
```

---

# 14. Status Calculation

```mermaid
flowchart TD
    A[DoctorsAvailability] --> B[Get Current Day]
    B --> C[Get Current Time]

    C --> D{Day matches?}

    D -->|No| E[Find Next Availability]
    D -->|Yes| F{Current Time within start/end?}

    F -->|Yes| G[🟢 PRESENT]
    F -->|No| E

    E --> H[🔴 NOT PRESENT]
    H --> I[Calculate Next Visit]
```

---

# 15. Recommended API

A possible endpoint:

```http
GET /doctors/nearby
```

Parameters:

```text
latitude
longitude
radius
doctorName
specialization
clinicId
hospitalId
```

Example:

```http
GET /doctors/nearby?latitude=23.3441&longitude=85.3240&radius=10&specialization=Cardiology
```

The backend should return **location-based results**, not just doctors.

One doctor can therefore appear multiple times if they have multiple nearby facilities.

Example:

```json
{
  "results": [
    {
      "doctorId": "D1",
      "doctorName": "Dr. Rahul",
      "specialization": "Cardiology",
      "facilityType": "hospital",
      "facilityId": "H1",
      "facilityName": "Apollo Hospital",
      "latitude": 23.3500,
      "longitude": 85.3200,
      "distanceKm": 1.2,
      "status": "PRESENT"
    },
    {
      "doctorId": "D1",
      "doctorName": "Dr. Rahul",
      "specialization": "Cardiology",
      "facilityType": "clinic",
      "facilityId": "C1",
      "facilityName": "City Clinic",
      "latitude": 23.3600,
      "longitude": 85.3150,
      "distanceKm": 2.4,
      "status": "NOT_PRESENT",
      "nextVisit": {
        "weekday": "Thursday",
        "startTime": "16:00",
        "endTime": "20:00"
      }
    }
  ]
}
```

This is important because your UI requirement is:

> Show **all locations where the doctor is present/visits**.

---

# 16. Google Maps UI

The frontend receives:

```text
doctor
facility
latitude
longitude
distance
status
nextVisit
```

and renders:

```mermaid
flowchart LR
    API[Nearby Doctors API] --> MAP[Google Maps]

    MAP --> P[Patient Marker]

    MAP --> G[🟢 Present Doctor Marker]
    MAP --> R[🔴 Future Visit Doctor Marker]

    G --> GI[Doctor Info Window]
    R --> RI[Doctor + Next Visit Info]
```

The Google Maps layer is responsible for displaying markers.

The HealthSync backend is responsible for deciding:

```text
Who?
Where?
How far?
Present?
Next visit?
```

---

# 17. Important Database Rule

Your `DoctorsAvailability` currently has:

```ts
hospital?: Hospital;
clinic?: Clinic;
```

Logically, each availability should belong to:

```text
Clinic XOR Hospital
```

meaning exactly one:

```text
Clinic OR Hospital
```

not:

```text
Clinic + Hospital
```

and not:

```text
nothing
```

Validate this in your service:

```ts
if (!clinicId && !hospitalId) {
  throw new BadRequestException(
    'Either clinic or hospital is required',
  );
}

if (clinicId && hospitalId) {
  throw new BadRequestException(
    'Availability cannot belong to both clinic and hospital',
  );
}
```

---

# 18. Final Architecture

Your current design can therefore be represented as:

```mermaid
flowchart TB
    subgraph FACILITIES[Physical Facilities]
        C[Clinic<br/>Name + Address + Lat/Lng]
        H[Hospital<br/>Name + Address + Lat/Lng]
    end

    subgraph DOCTOR_DOMAIN[Doctor Domain]
        D[Doctor]
        A[DoctorsAvailability<br/>Weekday + Time + Slot Duration]
    end

    D --> A
    A --> C
    A --> H

    C -. "Many doctors" .-> D
    H -. "Many doctors" .-> D

    P[Patient GPS] --> SEARCH[Nearby Facility Search]

    SEARCH --> C
    SEARCH --> H

    C --> A
    H --> A

    A --> STATUS[Calculate Current Status]
    STATUS --> GREEN[🟢 Present]
    STATUS --> RED[🔴 Not Present + Next Visit]

    GREEN --> MAP[Google Maps]
    RED --> MAP
```

---

# 19. Final Data Model

The clean mental model for your current implementation is:

```mermaid

erDiagram
    DOCTOR ||--o{ DOCTORS_AVAILABILITY : has

    DOCTORS_AVAILABILITY }o--|| CLINIC : "at"
    DOCTORS_AVAILABILITY }o--|| HOSPITAL : "at"

    DOCTOR {
        uuid id PK
        string specialization
        int experience
        string licenseNumber
        int appointmentFee
    }

    DOCTORS_AVAILABILITY {
        uuid id PK
        uuid doctor_id FK
        uuid clinic_id FK
        uuid hospital_id FK
        string weekday
        time startTime
        time endTime
        int slotDuration
    }

    CLINIC {
        uuid id PK
        string name
        string address
        decimal latitude
        decimal longitude
    }

    HOSPITAL {
        uuid id PK
        string name
        string address
        decimal latitude
        decimal longitude
    }
```

**This means you do not need `DoctorsLocation` with your current design.** `DoctorsAvailability` already provides the doctor → facility relationship plus the schedule, while `Clinic`/`Hospital` provide the physical coordinates.

One architectural improvement I'd consider later is replacing the two nullable foreign keys (`clinic_id` and `hospital_id`) with a common `Facility`/`HealthcareFacility` table. But for your current project, your existing design is perfectly workable and keeps the implementation straightforward.
