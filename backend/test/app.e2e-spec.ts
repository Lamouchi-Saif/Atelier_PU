import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppController } from '../src/app.controller.js';
import { AppService } from '../src/app.service.js';
import { AppointmentsController } from '../src/appointments/contollers/appointments.controller.js';
import { AppointmentsService } from '../src/appointments/services/appointments.service.js';
import { AppointmentRepository } from '../src/appointments/repositories/appointment.repository.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, AppointmentsController],
      providers: [AppService, AppointmentsService, AppointmentRepository],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/appointments (POST) reserves an available slot', () => {
    return request(app.getHttpServer())
      .post('/appointments')
      .send({ patientId: 'patient-1', slotId: 'slot-1' })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          patientId: 'patient-1',
          slotId: 'slot-1',
          status: 'CONFIRMED',
        });
      });
  });

  it('/appointments (POST) rejects a slot reserved twice', async () => {
    await request(app.getHttpServer())
      .post('/appointments')
      .send({ patientId: 'patient-1', slotId: 'slot-1' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/appointments')
      .send({ patientId: 'patient-2', slotId: 'slot-1' })
      .expect(409)
      .expect(({ body }) => {
        expect(body.message).toBe('Slot is already reserved');
      });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
