﻿using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Umbraco.Core;
using Umbraco.Core.Configuration;
using Umbraco.Core.Hosting;
using Umbraco.Core.WebAssets;
using Umbraco.Extensions;
using Umbraco.Web.Common.Filters;
using Umbraco.Web.Install;
using Umbraco.Web.Security;

namespace Umbraco.Web.Common.Install
{

    /// <summary>
    /// The Installation controller
    /// </summary>
    [InstallAuthorize]
    [Area(Umbraco.Core.Constants.Web.Mvc.InstallArea)]
    public class InstallController : Controller
    {
        private readonly IUmbracoContextAccessor _umbracoContextAccessor;
        private readonly InstallHelper _installHelper;
        private readonly IRuntimeState _runtime;
        private readonly IGlobalSettings _globalSettings;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IUmbracoVersion _umbracoVersion;
        private readonly IRuntimeMinifier _runtimeMinifier;

        public InstallController(
            IUmbracoContextAccessor umbracoContextAccessor,
            InstallHelper installHelper,
            IRuntimeState runtime,
            IGlobalSettings globalSettings,
            IRuntimeMinifier runtimeMinifier,
            IHostingEnvironment hostingEnvironment,
            IUmbracoVersion umbracoVersion)
        {
            _umbracoContextAccessor = umbracoContextAccessor;
            _installHelper = installHelper;
            _runtime = runtime;
            _globalSettings = globalSettings;
            _runtimeMinifier = runtimeMinifier;
            _hostingEnvironment = hostingEnvironment;
            _umbracoVersion = umbracoVersion;
        }

        [HttpGet]
        [StatusCodeResult(System.Net.HttpStatusCode.ServiceUnavailable)]
        [TypeFilter(typeof(StatusCodeResultAttribute), Arguments = new object []{System.Net.HttpStatusCode.ServiceUnavailable})]
        public async Task<ActionResult> Index()
        {
            var umbracoPath = Url.GetBackOfficeUrl();

            if (_runtime.Level == RuntimeLevel.Run)
                return Redirect(umbracoPath);

            if (_runtime.Level == RuntimeLevel.Upgrade)
            {
                // Update ClientDependency version and delete its temp directories to make sure we get fresh caches
                _runtimeMinifier.Reset();

                var result = _umbracoContextAccessor.UmbracoContext.Security.ValidateCurrentUser(false);

                switch (result)
                {
                    case ValidateRequestAttempt.FailedNoPrivileges:
                    case ValidateRequestAttempt.FailedNoContextId:
                        return Redirect(_globalSettings.UmbracoPath + "/AuthorizeUpgrade?redir=" + Request.GetEncodedUrl());
                }
            }

            // gen the install base url
            ViewData.SetInstallApiBaseUrl(Url.GetInstallerApiUrl());

            // get the base umbraco folder
            ViewData.SetUmbracoBaseFolder(_hostingEnvironment.ToAbsolute(_globalSettings.UmbracoPath));

            ViewData.SetUmbracoVersion(_umbracoVersion.SemanticVersion);

            await _installHelper.InstallStatus(false, "");

            return View();
        }
    }
}
