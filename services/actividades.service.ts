import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Actividad } from "../entities/actividad.entity";
import { Repository } from "typeorm";
import { ActividadDto } from "../dtos/actividad.dto";
import { PrioridadActividadEnum } from "../enums/prioridadActividad.enum";
import { EstadosActividadEnum } from "../enums/estadoActividad.enum";
import { FindOneOptions } from "typeorm";
import { parseISO } from "date-fns";
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ActividadesService {
    constructor(@InjectRepository(Actividad) private actividadesRepo: Repository<Actividad>) {}

    async obtenerActividades(): Promise<Actividad[]> {
        try {
          const actividades: Actividad[] = await this.actividadesRepo.find();
          return actividades;
        } catch (error) {
          // Manejo de errores aquí
          throw new Error('Ocurrió un error al obtener las actividades.');
        }
      }

      async obtenerActividadPorId(id: number): Promise<Actividad> {
        const opciones: FindOneOptions<Actividad> = { where: { idActividad: id } };
        return await this.actividadesRepo.findOneOrFail(opciones);
      }

      async registroActividad(datosNuevaActividad: ActividadDto): Promise<Actividad> {
        const { descripcion, idUsuario, idActividad, idUsuarioModificacion, fechaModificacion, prioridad, estado } = datosNuevaActividad;

        // Verificar si la actividad ya existe
        const actividadExistente = await this.actividadesRepo.findOne({
            where: { idActividad }
        });

        if (actividadExistente) {
            throw new BadRequestException('La actividad con el ID proporcionado ya está registrada.');
        }

        // Crear una nueva actividad
        const nuevaActividad = this.actividadesRepo.create({
            descripcion,
            idUsuario,
            idActividad,
            idUsuarioModificacion,
            fechaModificacion, // Mantenemos la fecha como un objeto Date
            prioridad,
            estado,
        });

        // Guardar la nueva actividad en la base de datos
        try {
            await this.actividadesRepo.save(nuevaActividad);
        } catch (error) {
            throw new BadRequestException('Error al registrar la actividad.');
        }

        return nuevaActividad;
    }


    
    

    async actualizarActividad(id: number, actividadDto: ActividadDto): Promise<Actividad> {
        const actividadExistente = await this.obtenerActividadPorId(id);

        actividadExistente.descripcion = actividadDto.descripcion;
        actividadExistente.idUsuarioModificacion = actividadDto.idUsuarioModificacion;
        actividadExistente.fechaModificacion = actividadDto.fechaModificacion;

        try {
            await this.actividadesRepo.save(actividadExistente);
        } catch (error) {
            throw new BadRequestException('Error al actualizar la actividad.');
        }

        return actividadExistente;
    }

    async eliminarActividad(idActividad: number): Promise<string> {
        const actividadExistente = await this.actividadesRepo.findOne({ where: { idActividad } });
      
        if (!actividadExistente) {
          throw new NotFoundException('La actividad a eliminar no existe.');
        }
      
        await this.actividadesRepo.remove(actividadExistente);
      
        return `La actividad con ID ${idActividad} fue eliminada correctamente.`;
      }
}
