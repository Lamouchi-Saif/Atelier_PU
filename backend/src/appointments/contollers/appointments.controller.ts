import { Body, Controller, Post } from '@nestjs/common';

import { ReserveAppointmentDto } from '../dto/reserve-appointment.dto.js';
import type { Appointment } from '../entities/appointment.entity.js';
import { AppointmentsService } from '../services/appointments.service.js';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  reserve(@Body() dto: ReserveAppointmentDto): Appointment {
    return this.appointmentsService.reserve(dto);
  }
}
