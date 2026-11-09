using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using api.DTOs;
using api.Entidades;

namespace api.Controllers
{
    [Route("api/cines")]
    [ApiController]
    public class CinesController : CustomBaseController
    {
        private const string cacheTag = "cines";

        public CinesController(ApplicationDbContext context, IMapper mapper,
            IOutputCacheStore outputCacheStore)
            : base(context, mapper, outputCacheStore, cacheTag)
        {
        }

        [HttpGet] // api/cines?pagina=1&recordsPorPagina=10
        [OutputCache(Tags = [cacheTag])]
        public async Task<List<CineDTO>> Get([FromQuery] PaginacionDTO paginacion)
        {
            return await Get<Cine, CineDTO>(paginacion, ordenarPor: c => c.Nombre);
        }

        [HttpGet("todos")] // api/cines/todos
        [OutputCache(Tags = [cacheTag])]
        public async Task<List<CineDTO>> Get()
        {
            return await Get<Cine, CineDTO>(ordenarPor: c => c.Nombre);
        }

        [HttpGet("{id:int}", Name = "ObtenerCinePorId")] // api/cines/5
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<CineDTO>> Get(int id)
        {
            return await Get<Cine, CineDTO>(id);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CineCreacionDTO cineCreacionDTO)
        {
            return await Post<CineCreacionDTO, Cine, CineDTO>(cineCreacionDTO, "ObtenerCinePorId");
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] CineCreacionDTO cineCreacionDTO)
        {
            return await Put<CineCreacionDTO, Cine>(id, cineCreacionDTO);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            return await Delete<Cine>(id);
        }
    }
}
