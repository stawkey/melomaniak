using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models;

public partial class Programme
{
    public int Id { get; set; }

    public int? ConcertId { get; set; }

    public string? Piece { get; set; }

    [JsonIgnore]
    public virtual Concert? Concert { get; set; }
}
