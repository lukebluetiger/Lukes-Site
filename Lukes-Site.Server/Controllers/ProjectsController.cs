using Microsoft.AspNetCore.Mvc;
using lukes_site.Server.Models;
using lukes_site.Server.Services;

namespace lukes_site.Server.Controllers
{
    [Route("api/Projects")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            return Ok(projects);
        }

        [HttpGet("{slug}")]
        public async Task<ActionResult<ProjectDto>> GetProject(string slug)
        {
            var project = await _projectService.GetProjectBySlugAsync(slug);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }

        [HttpGet("technology/{technology}")]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjectsByTechnology(string technology)
        {
            var projects = await _projectService.GetProjectsByTechnologyAsync(technology);
            return Ok(projects);
        }

        [HttpGet("technologies")]
        public async Task<ActionResult<IEnumerable<string>>> GetAllTechnologies()
        {
            var technologies = await _projectService.GetAllTechnologiesAsync();
            return Ok(technologies);
        }
    }
}