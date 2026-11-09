import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { SubmitHandler } from "react-hook-form";
import type { AxiosError } from "axios";
import FormularioCine from "./FormularioCine";
import type CineCreacion from "../modelos/CineCreacion.model";
import type Cine from "../modelos/Cine.model";
import Cargando from "../../../componentes/Cargando";
import clienteAPI from "../../../api/clienteAxios";
import { extraerErrores } from "../../../utilidades/extraerErrores";

export default function EditarCine() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [modelo, setModelo] = useState<CineCreacion | undefined>(undefined);
    const [errores, setErrores] = useState<string[]>([]);

    useEffect(() => {
        clienteAPI.get<Cine>(`/cines/${id}`)
            .then(res => {
                const { nombre, latitud, longitud } = res.data;
                setModelo({ nombre, latitud, longitud });
            })
            .catch(() => navigate('/cines'));
    }, [id, navigate]);

    const onSubmit: SubmitHandler<CineCreacion> = async (data) => {
        try {
            await clienteAPI.put(`/cines/${id}`, data);
            navigate('/cines');
        } catch (err) {
            setErrores(extraerErrores(err as AxiosError));
        }
    }

    return (
        <>
            <h3>Editar Cine</h3>
            {modelo ? <FormularioCine errores={errores} modelo={modelo} onSubmit={onSubmit} /> : <Cargando />}
        </>
    )
}
