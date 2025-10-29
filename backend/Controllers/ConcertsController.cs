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

        return Ok(pagedConcerts);
    }

    private IQueryable<Concert> GetFilteredConcerts(ConcertFilter filter)
    {
        var query = _context.Concerts
            .Include(c => c.Composers)
            .Include(c => c.Programmes)
            .Where(c => c.Date >= filter.StartDate)
            .AsQueryable();

        if (filter.Composers != null)
            query = query.Where(c => c.Composers.Any(p => p.Composer1 != null && EF.Functions.ILike(p.Composer1, $"%{filter.Composers}%")));

        if (filter.Programme != null)
            query = query.Where(c => c.Programmes.Any(p => p.Piece != null && EF.Functions.ILike(p.Piece, $"%{filter.Programme}%")));

        if (filter.EndDate != null)
            query = query.Where(c => c.Date <= filter.EndDate);

        if (filter.Venue != null)
            query = query.Where(c => c.Venue != null && EF.Functions.ILike(c.Venue, $"%{filter.Venue}%"));

        if (filter.ConcertType != null)
            query = query.Where(c => c.ConcertType != null && EF.Functions.ILike(c.ConcertType, $"%{filter.ConcertType}%"));

        if (filter.ConcertTitle != null)
            query = query.Where(c => c.Title != null && EF.Functions.ILike(c.Title, $"%{filter.ConcertTitle}%"));

        if (filter.Source != null)
            query = query.Where(c => c.Source != null && EF.Functions.ILike(c.Source, $"%{filter.Source}%"));

        return query;
    }
}
