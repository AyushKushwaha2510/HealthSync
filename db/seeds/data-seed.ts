import { EntityManager } from "typeorm";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";
import { User } from "src/users/entities/user.entity";
import { Doctor } from "src/doctors/entities/doctor.entity";
import { Patient } from "src/patients/entities/patient.entity";
import { Appointment } from "src/appointments/entities/appointment.entity";

enum Role {
    Admin = 'admin',
    Doctor = 'doctor',
    Patient = 'patient'
}

export const seedData = async (manager: EntityManager): Promise<void> => {

    // ---------------- USER ----------------
    async function seedUser(role: Role) {
        const salt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash("1234", salt);

        const user = new User();
        user.firstName = faker.person.firstName();
        user.lastName = faker.person.lastName();
        user.email = faker.internet.email();
        user.dob = faker.date.birthdate();
        user.gender = faker.person.sex();
        user.password = encryptedPassword;
        user.role = role;

        return await manager.getRepository(User).save(user);
    }

    // ---------------- DOCTOR ----------------
    async function seedDoctor() {
        const user = await seedUser(Role.Doctor);

        const doctor = new Doctor();
        doctor.specialization = faker.person.jobArea();
        doctor.experience = faker.number.int({ min: 1, max: 20 });
        doctor.hospital = faker.company.name();
        doctor.licenseNumber = faker.string.uuid();
        doctor.user = user;

        return await manager.getRepository(Doctor).save(doctor);
    }

    // ---------------- PATIENT ----------------
    async function seedPatient() {
        const user = await seedUser(Role.Patient);

        const patient = new Patient();
        patient.disease = faker.lorem.word();
        patient.user = user;

        return await manager.getRepository(Patient).save(patient);
    }

    // ---------------- APPOINTMENT ----------------
    async function seedAppointment(doctor: Doctor, patient: Patient) {
        const appointment = new Appointment();
        appointment.doctor = doctor;
        appointment.patient = patient;
        appointment.appointment_date = faker.date.soon();
        appointment.appointment_time = faker.date.soon();

        return await manager.getRepository(Appointment).save(appointment);
    }

    // ---------------- MAIN FLOW ----------------

    const doctor = await seedDoctor();
    const patient = await seedPatient();

    await seedAppointment(doctor, patient);
};