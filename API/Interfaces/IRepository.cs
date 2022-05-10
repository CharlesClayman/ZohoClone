using System.Linq.Expressions;

namespace API.Interfaces
{
    public interface IRepository<MT,T>
    {
        void Add(MT item);
        void AddRange(IEnumerable<MT> items);
        Task<bool> Exists(T id);
        Task<MT> GetSingle(T Id);
        IQueryable<MT> GetAllAsQueryable();
        IQueryable<MT> GetSingleAsQueryable();
        void Update(MT item);
        void Delete(MT item);
        Task SaveChangesAsync();
    }
}
