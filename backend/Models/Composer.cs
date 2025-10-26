using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models;

public partial class Composer
{
    public int Id { get; set; }

    public int? ConcertId { get; set; }

    public string? Composer1 { get; set; }

    [JsonIgnore]
    public virtual Concert? Concert { get; set; }
}
