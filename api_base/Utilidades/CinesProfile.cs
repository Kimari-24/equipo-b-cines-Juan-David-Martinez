using AutoMapper;
using api.DTOs;
using api.Entidades;

namespace api.Utilidades
{
    // Cine -> CineDTO ya está registrado en AutoMapperProfiles (mapeos de lectura).
    // Repetirlo aquí lanza DuplicateTypeMapConfigurationException en AutoMapper 14.
    public class CinesProfile : Profile
    {
        public CinesProfile()
        {
            CreateMap<CineCreacionDTO, Cine>();
        }
    }
}
