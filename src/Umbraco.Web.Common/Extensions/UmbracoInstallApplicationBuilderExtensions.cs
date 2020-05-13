﻿using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Web.Common.Install;

namespace Umbraco.Extensions
{
    public static class UmbracoInstallApplicationBuilderExtensions
    {
        /// <summary>
        /// Enables the Umbraco installer
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseUmbracoInstaller(this IApplicationBuilder app)
        {
            app.UseEndpoints(endpoints =>
            {
                var backOfficeRoutes = app.ApplicationServices.GetRequiredService<InstallAreaRoutes>();
                backOfficeRoutes.CreateRoutes(endpoints);
            });

            return app;
        }

        
    }

}
