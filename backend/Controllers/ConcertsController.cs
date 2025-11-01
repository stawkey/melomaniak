using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Text.Json;
using System.Threading.Tasks;


namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ConcertsController(FilharmoniaContext context) : ControllerBase
{
    private readonly FilharmoniaContext _context = context;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] SearchParameters searchParameters)
    {
        ConcertFilter filters = searchParameters.Filters ?? new ConcertFilter();

        var query = GetFilteredConcerts(filters);

        var pagedConcerts = await PaginatedList<Concert>.CreateAsync(
            query.AsQueryable(), searchParameters.PageNumber, searchParameters.PageSize);

        var response = new
        {
            PageNumber = pagedConcerts.PageNumber,
            TotalPages = pagedConcerts.TotalPages,
            Concerts = pagedConcerts
        };

        return Ok(response);
    }

    private IQueryable<Concert> GetFilteredConcerts(ConcertFilter filter)
    {
        var query = _context.Concerts
            .Include(c => c.Composers)
            .Include(c => c.Programmes)
            .OrderBy(c => c.Date)
            .AsQueryable();

        var filters = new List<(bool condition, Expression<Func<Concert, bool>> predicate)>
        {
            (true, c => c.Date.Value.Date >= filter.StartDate.Date),
            (filter.EndDate.HasValue, c => c.Date.Value.Date <= filter.EndDate.Value.Date),
            (!string.IsNullOrEmpty(filter.Venue), c => c.Venue != null && EF.Functions.ILike(c.Venue, $"%{filter.Venue}%")),
            (!string.IsNullOrEmpty(filter.ConcertType), c => c.ConcertType != null && EF.Functions.ILike(c.ConcertType, $"%{filter.ConcertType}%")),
            (!string.IsNullOrEmpty(filter.Title), c => c.Title != null && EF.Functions.ILike(c.Title, $"%{filter.Title}%")),
            (!string.IsNullOrEmpty(filter.Source), c => c.Source != null && EF.Functions.ILike(c.Source, $"%{filter.Source}%")),
            (!string.IsNullOrEmpty(filter.Composers), c => c.Composers.Any(p => p.Composer1 != null && EF.Functions.ILike(p.Composer1, $"%{filter.Composers}%"))),
            (!string.IsNullOrEmpty(filter.Programme), c => c.Programmes.Any(p => p.Piece != null && EF.Functions.ILike(p.Piece, $"%{filter.Programme}%")))
        };

        return filters.Where(f => f.condition)
                      .Aggregate(query, (current, f) => current.Where(f.predicate));
    }
}
