﻿using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Api.Management.Factories;
using Umbraco.Cms.Api.Management.ViewModels.AuditLogs;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Exceptions;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Cms.Api.Management.Controllers.AuditLog;

[ApiVersion("1.0")]
public class CurrentUserAuditLogController : AuditLogControllerBase
{
    private readonly IAuditService _auditService;
    private readonly IAuditLogPresentationFactory _auditLogPresentationFactory;
    private readonly IUserService _userService;

    public CurrentUserAuditLogController(
        IAuditService auditService,
        IAuditLogPresentationFactory auditLogPresentationFactory,
        IUserService userService)
    {
        _auditService = auditService;
        _auditLogPresentationFactory = auditLogPresentationFactory;
        _userService = userService;
    }

    [HttpGet]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(PagedViewModel<AuditLogWithUsernameResponseModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CurrentUser(CancellationToken cancellationToken, Direction orderDirection = Direction.Descending, DateTime? sinceDate = null, int skip = 0, int take = 100)
    {
        // FIXME: Pull out current backoffice user when its implemented.
        // var userId = _backOfficeSecurityAccessor.BackOfficeSecurity?.GetUserId().Result ?? -1;
        var userId = Constants.Security.SuperUserId;

        IUser? user = _userService.GetUserById(userId);

        if (user is null)
        {
            throw new PanicException("Could not find current user");
        }

        PagedModel<IAuditItem> result = await _auditService.GetPagedItemsByUserAsync(
            user.Key,
            skip,
            take,
            orderDirection,
            null,
            sinceDate);

        IEnumerable<AuditLogWithUsernameResponseModel> mapped = _auditLogPresentationFactory.CreateAuditLogWithUsernameViewModels(result.Items);
        var viewModel = new PagedViewModel<AuditLogWithUsernameResponseModel>
        {
            Total = result.Total,
            Items = mapped,
        };

        return Ok(viewModel);
    }
}
