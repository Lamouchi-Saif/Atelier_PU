import { Injectable } from '@nestjs/common';

import { Appointment } from '../entities/appointment.entity.js';

@Injectable()
export class AppointmentRepository {
  private readonly availableSlots = new Set(['slot-1', 'slot-2']);
  private readonly appointments = new Map<string, Appointment>();

  isSlotAvailable(slotId: string): boolean {
    return this.availableSlots.has(slotId);
  }

  reserve(patientId: string, slotId: string): Appointment {
    if (!this.isSlotAvailable(slotId)) {
      throw new Error('Slot is unavailable');
    }

    this.availableSlots.delete(slotId);
    const appointment: Appointment = {
      id: `appointment-${this.appointments.size + 1}`,
      patientId,
      slotId,
      status: 'CONFIRMED',
    };
    this.appointments.set(appointment.id, appointment);
    return appointment;
  }
}
