import { useForm, type SubmitHandler } from "react-hook-form";
import type CineCreacion from "../modelos/CineCreacion.model";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { primeraLetraMayuscula } from "../../../validaciones/Validaciones";
import Boton from "../../../componentes/Boton";
import { NavLink } from "react-router";
import Mapa from "../../../componentes/Mapa/Mapa";
import MostrarErrores from "../../../componentes/MostrarErrores";

export default function FormularioCine(props: FormularioCineProps) {

    const { register, handleSubmit, setValue,
        formState: { errors, isValid, isSubmitting } }
        = useForm<CineCreacion>({
            resolver: yupResolver(reglasDeValidacion),
            mode: 'onChange',
            defaultValues: props.modelo ?? { nombre: '' }
        });

    const coordenadas = props.modelo
        ? [{ lat: props.modelo.latitud, lng: props.modelo.longitud }]
        : undefined;

    return (
        <>
            <MostrarErrores errores={props.errores} />
            <form onSubmit={handleSubmit(props.onSubmit)}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" id="nombre" className="form-control" autoComplete="off"
                        {...register('nombre')} />
                    {errors.nombre && <p className="error">{errors.nombre.message}</p>}
                </div>

                <div className="row mt-2">
                    <div className="col">
                        <label htmlFor="latitud">Latitud</label>
                        <input id="latitud" className="form-control" readOnly
                            placeholder="Seleccione en el mapa" {...register('latitud')} />
                        {errors.latitud && <p className="error">{errors.latitud.message}</p>}
                    </div>
                    <div className="col">
                        <label htmlFor="longitud">Longitud</label>
                        <input id="longitud" className="form-control" readOnly
                            placeholder="Seleccione en el mapa" {...register('longitud')} />
                        {errors.longitud && <p className="error">{errors.longitud.message}</p>}
                    </div>
                </div>

                <div className="mt-4">
                    <Mapa coordenadas={coordenadas}
                        lugarSeleccionado={coordenada => {
                            setValue('latitud', coordenada.lat, { shouldValidate: true });
                            setValue('longitud', coordenada.lng, { shouldValidate: true });
                        }} />
                </div>

                <div className="mt-2">
                    <Boton type="submit" disabled={!isValid || isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar'}</Boton>
                    <NavLink to="/cines" className="btn btn-secondary ms-2">Cancelar</NavLink>
                </div>
            </form>
        </>
    )
}

interface FormularioCineProps {
    modelo?: CineCreacion;
    onSubmit: SubmitHandler<CineCreacion>;
    errores: string[];
}

const reglasDeValidacion = yup.object({
    nombre: yup.string().required('El nombre es obligatorio')
        .max(75, 'El nombre debe tener 75 caracteres o menos')
        .test(primeraLetraMayuscula()),
    latitud: yup.number().typeError('Seleccione una ubicación en el mapa')
        .required('Seleccione una ubicación en el mapa')
        .min(-90, 'La latitud debe estar entre -90 y 90').max(90, 'La latitud debe estar entre -90 y 90'),
    longitud: yup.number().typeError('Seleccione una ubicación en el mapa')
        .required('Seleccione una ubicación en el mapa')
        .min(-180, 'La longitud debe estar entre -180 y 180').max(180, 'La longitud debe estar entre -180 y 180')
})
