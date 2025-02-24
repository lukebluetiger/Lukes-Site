using lukes_site.Server.Models;

namespace lukes_site.Server.Services
{
    public interface IProjectService
    {
        public Task<IEnumerable<string>> GetAllTechnologiesAsync();
        public Task<IEnumerable<ProjectDto>> GetAllProjectsAsync();
        public Task<ProjectDto?> GetProjectBySlugAsync(string slug);
        public Task<IEnumerable<ProjectDto>> GetProjectsByTechnologyAsync(string technology);

    }
}
