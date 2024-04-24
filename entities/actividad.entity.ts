import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EstadosActividadEnum } from '../enums/estadoActividad.enum';
import { PrioridadActividadEnum } from '../enums/prioridadActividad.enum';

@Entity({name: 'actividades'})
export class Actividad{

    @PrimaryGeneratedColumn()
    idActividad: number

    @Column()
    descripcion: string

    @Column()
    idUsuario: number
    
    @Column()
    idUsuarioModificacion: number

    @Column()
    fechaModificacion: string

    @Column({type: 'enum', enum: PrioridadActividadEnum})
    prioridad: PrioridadActividadEnum

    @Column({type: 'enum', enum: EstadosActividadEnum})
    estado: EstadosActividadEnum

}