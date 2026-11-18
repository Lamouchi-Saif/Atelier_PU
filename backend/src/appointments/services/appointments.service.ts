import { ConflictException, Injectable } from '@nestjs/common';

import { ReserveAppointmentDto } from '../dto/reserve-appointment.dto.js';
import { Appointment } from '../entities/appointment.entity.js';
import { AppointmentRepository } from '../repositories/appointment.repository.js';

@Injectable()
export class AppointmentsService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  reserve(dto: ReserveAppointmentDto): Appointment {
    if (!dto.patientId || !dto.slotId) {
      throw new ConflictException('patientId and slotId are required');
    }

    if (!this.appointmentRepository.isSlotAvailable(dto.slotId)) {
      throw new ConflictException('Slot is already reserved');
    }

    return this.appointmentRepository.reserve(dto.patientId, dto.slotId);
  }
}
