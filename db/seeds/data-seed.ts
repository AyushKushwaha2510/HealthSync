import { EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { Role, User } from 'src/users/entities/user.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import {
  DoctorRegistrationRequest,
  Status,
} from 'src/doctor-registration-request/entities/doctor-registration-request.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { DoctorsAvailability } from 'src/doctors-availability/entities/doctors-availability.entity';

export const seedData = async (manager: EntityManager): Promise<void> => {
  // ---------------- USER ----------------
  async function seedUser(role: Role) {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('1234', salt);

    const user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.dob = faker.date
      .birthdate({
        min: 18,
        max: 70,
        mode: 'age',
      })
      .toISOString()
      .split('T')[0];
    user.gender = faker.person.sex();
    user.password = encryptedPassword;
    user.role = role;

    return await manager.getRepository(User).save(user);
  }

  // // ---------------- DOCTOR ----------------
  // async function seedDoctorRequest() {
  //     const user = await seedUser(Role.PATIENT);

  //     const doctor = new DoctorRegistrationRequest();
  //     doctor.specialization = faker.person.jobArea();
  //     doctor.experience = faker.number.int({ min: 1, max: 20 });
  //     // doctor.hospitals = faker.company.name();
  //     doctor.licenseNumber = faker.string.uuid();
  //     doctor.status = Status.PENDING
  //     doctor.user = user;

  //     return await manager.getRepository(DoctorRegistrationRequest).save(doctor);
  // }

  // // ---------------- DOCTOR ----------------
  // async function seedDoctor() {
  //     const user = await seedUser(Role.DOCTOR);

  //     const doctor = new Doctor();
  //     doctor.specialization = faker.person.jobArea();
  //     doctor.experience = faker.number.int({ min: 1, max: 20 });
  //     doctor.hospital = faker.company.name();
  //     doctor.licenseNumber = faker.string.uuid();
  //     doctor.user = user;

  //     return await manager.getRepository(Doctor).save(doctor);
  // }

  // // ---------------- PATIENT ----------------
  // async function seedPatient() {
  //     const user = await seedUser(Role.PATIENT);

  //     const patient = new Patient();
  //     patient.disease = faker.lorem.word();
  //     patient.user = user;

  //     return await manager.getRepository(Patient).save(patient);
  // }

  // // ---------------- APPOINTMENT ----------------
  // async function seedAppointment(doctor: Doctor, patient: Patient) {
  //     const appointment = new Appointment();
  //     appointment.doctor = doctor;
  //     appointment.patient = patient;
  //     appointment.appointment_date = faker.date.soon();
  //     appointment.appointment_time = faker.date.soon();

  //     return await manager.getRepository(Appointment).save(appointment);
  // }

  // // ---------------- MAIN FLOW ----------------

  // const doctor = await seedDoctor();
  // const patient = await seedPatient();

  // const doctorRequest = await seedDoctorRequest();
  // // await seedAppointment(doctor, patient);

  async function seedHospital() {
    const hospital = new Hospital();

    hospital.name = faker.helpers.arrayElement(HOSPITALS);

    hospital.phone = faker.phone.number();

    hospital.address = {
      line1: faker.location.street(),
      city: 'Patna',
      state: 'Bihar',
      country: 'India',
      pinCode: faker.location.zipCode(),
    };

    return manager.save(hospital);
  }
  async function seedClinic() {
    const clinic = new Clinic();

    clinic.name = faker.helpers.arrayElement(CLINICS);

    clinic.phone = faker.phone.number();

    clinic.address = {
      line1: faker.location.street(),
      city: 'Patna',
      state: 'Bihar',
      country: 'India',
      pinCode: faker.location.zipCode(),
    };

    return manager.save(clinic);
  }
  async function seedDoctor(hospitals: Hospital[], clinics: Clinic[]) {
    const user = await seedUser(Role.DOCTOR);

    const doctor = new Doctor();

    doctor.user = user;

    doctor.specialization = faker.helpers.arrayElement(SPECIALIZATIONS);

    doctor.experience = faker.number.int({
      min: 1,
      max: 25,
    });

    doctor.licenseNumber = `MED-${faker.number.int({
      min: 100000,
      max: 999999,
    })}`;

    doctor.hospitals = faker.helpers.arrayElements(
      hospitals,
      faker.number.int({ min: 1, max: 2 }),
    );

    doctor.clinics = faker.helpers.arrayElements(
      clinics,
      faker.number.int({ min: 1, max: 3 }),
    );

    return manager.save(doctor);
  }
  async function seedPatient() {
    const user = await seedUser(Role.PATIENT);

    const patient = new Patient();

    patient.user = user;

    patient.disease = faker.helpers.maybe(
      () => faker.helpers.arrayElement(DISEASES),
      {
        probability: 0.4,
      },
    );

    return manager.save(patient);
  }

  async function seedAvailability(doctor: Doctor) {
    const count = faker.number.int({
      min: 4,
      max: 6,
    });

    for (let i = 0; i < count; i++) {
      const availability = new DoctorsAvailability();

      availability.doctor = doctor;

      availability.weekday = faker.helpers.arrayElement(DAYS) as any;

      availability.startTime = '09:00';

      availability.endTime = '13:00';

      availability.slotDuration = 15;

      if (doctor.hospitals && doctor.hospitals.length) {
        availability.hospital = faker.helpers.arrayElement(doctor.hospitals);
      }

      await manager.save(availability);
    }
  }
  async function seedAppointment(doctors: Doctor[], patients: Patient[]) {
    const appointment = new Appointment();

    const doctor = faker.helpers.arrayElement(doctors);

    const patient = faker.helpers.arrayElement(patients);

    appointment.doctor = doctor;
    appointment.patient = patient;

    appointment.appointmentDateTime = faker.date.between({
      from: new Date('2026-01-01'),
      to: new Date('2026-12-31'),
    });
    appointment.bookingDateTime = faker.date.between({
      from: new Date('2026-01-01'),
      to: new Date('2026-12-31'),
    });

    const rand = Math.random();

    if (rand < 0.5) {
      appointment.status = 'confirmed' as any;
    } else if (rand < 0.7) {
      appointment.status = 'cancelled' as any;
    } else if (rand < 0.9) {
      appointment.status = 'pending_payment' as any;
    } else {
      appointment.status = 'completed' as any;
    }

    appointment.notes = faker.helpers.arrayElement([
      'Regular checkup',
      'Follow-up consultation',
      'Chest pain',
      'Fever and cough',
      'Skin allergy',
      'Migraine symptoms',
      'Routine visit',
    ]);

    const useHospital = Math.random() < 0.6;

    if (useHospital && doctor.hospitals?.length) {
      appointment.hospital = faker.helpers.arrayElement(doctor.hospitals);
    } else if (doctor.clinics?.length) {
      appointment.clinic = faker.helpers.arrayElement(doctor.clinics);
    }

    return manager.save(appointment);
  }
  const hospitals: Hospital[] = [];
  const clinics: Clinic[] = [];
  const doctors: Doctor[] = [];
  const patients: Patient[] = [];

  // admin
  // await seedAdmin();

  // hospitals
  for (let i = 0; i < 5; i++) {
    hospitals.push(await seedHospital());
  }

  // clinics
  for (let i = 0; i < 8; i++) {
    clinics.push(await seedClinic());
  }

  // doctors
  for (let i = 0; i < 15; i++) {
    const doctor = await seedDoctor(hospitals, clinics);

    doctors.push(doctor);

    await seedAvailability(doctor);
  }

  // patients
  for (let i = 0; i < 100; i++) {
    patients.push(await seedPatient());
  }

  // appointments
  for (let i = 0; i < 500; i++) {
    await seedAppointment(doctors, patients);
  }
};

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const SPECIALIZATIONS = [
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'Psychiatrist',
  'ENT Specialist',
  'Gynecologist',
  'Ophthalmologist',
  'General Physician',
];

export const DISEASES = [
  'Diabetes',
  'Hypertension',
  'Migraine',
  'Asthma',
  'Arthritis',
  'Flu',
  'Skin Allergy',
  'Back Pain',
  'Thyroid Disorder',
  'Anxiety',
];

export const HOSPITALS = [
  'AIIMS Patna',
  'Apollo Hospital Patna',
  'Paras HMRI',
  'Max Healthcare',
  'Medanta Patna',
];

export const CLINICS = [
  'Care Plus Clinic',
  'Family Care Clinic',
  'Health First Clinic',
  'Prime Care Center',
  'LifeCare Clinic',
  'Wellness Clinic',
  'City Health Point',
  'Healthy Living Clinic',
];
