import { Body, Controller, Get, Param, Post, Put, Delete } from "@nestjs/common";
import { ActividadDto } from "../dtos/actividad.dto";
import { ActividadesService } from "../services/actividades.service";
import { Actividad } from "../entities/actividad.entity";

@Controller("/actividades")
export class ActividadesController {
    constructor(private actividadesService: ActividadesService) {}

    @Get()
    async obtenerActividades(): Promise<Actividad[]> {
        return await this.actividadesService.obtenerActividades();
    }

    @Get("/:id")
    async obtenerActividadPorId(@Param("id") id: number): Promise<Actividad> {
        return await this.actividadesService.obtenerActividadPorId(id);
    }

    @Post()
  async crearActividad(@Body() actividadDto: ActividadDto): Promise<Actividad> {
    return await this.actividadesService.registroActividad(actividadDto);
  }

    @Put("/:id")
    async actualizarActividad(@Param("id") id: number, @Body() actividadDto: ActividadDto): Promise<Actividad> {
        return await this.actividadesService.actualizarActividad(id, actividadDto);
    }

    @Delete("/:id")
async eliminarActividad(@Param("id") id: number): Promise<{ mensaje: string }> {
  const actividadId = id;
  const mensaje = await this.actividadesService.eliminarActividad(actividadId);
  return { mensaje };
}
}
