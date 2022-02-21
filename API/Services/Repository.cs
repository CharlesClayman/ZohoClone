using API.Data;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Threading;

namespace API.Services
{
    public class Repository<MT,T> : IRepository<MT,T> where MT : class
    { 
        private readonly DataContext _context;
        private readonly DbSet<MT> _table;
        public Repository(DataContext context)
        {
            _context = context;
            _table = _context.Set<MT>();
        }
        public void Add(MT item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));
            _table.Add(item);
        }

        public void Delete(MT item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));
            _table.Remove(item);
        } 

        public async Task<bool> Exists(T id)
        {
           var entity = await _table.FindAsync(id) ;
            if(entity == null)
                return false;
            return true;
        }

        public async Task<IEnumerable<MT>> GetAllAsync()
        {
            return await _table.ToListAsync();
        }

        public IQueryable<MT> GetAllAsQueryable()
        {
            return _table.AsQueryable();
        }

        public async Task<MT> GetSingleAsync(T Id)
        {
            return await _table.FindAsync(Id);
        }
        public async Task<MT> GetSingleAsQueryableAsync(Expression<Func<MT,bool>> idMatch, params Expression<Func<MT,Object>>[] includes)
        {   
            IQueryable<MT> query = _table.AsQueryable();
            foreach(var include in includes)
                query = query.Include(include);
            return await query.FirstOrDefaultAsync(idMatch);
        }

        public async Task<bool> SaveChangesAsync()
        {
           return await _context.SaveChangesAsync() > 0;
        }

        public void Update(MT item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));
            _context.Entry(item).State = EntityState.Modified;
        }
    }
}
