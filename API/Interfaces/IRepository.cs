using System.Linq.Expressions;

namespace API.Interfaces
{
    public interface IRepository<MT,T>
    {
        void Add(MT item);
        Task<bool> Exists(T id);
        Task<MT> GetSingleAsync(T Id);
        Task<IEnumerable<MT>> GetAllAsync();
        IQueryable<MT> GetAllAsQueryable();
        void Update(MT item);
        void Delete(MT item);
        Task<bool> SaveChangesAsync();
        Task<MT> GetSingleAsQueryableAsync(Expression<Func<MT, bool>> idMatch, params Expression<Func<MT, Object>>[] includes);
    }
}
