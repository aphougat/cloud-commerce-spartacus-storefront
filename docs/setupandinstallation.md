# Setup and Installation

The following instructions describe how to build a storefront application from published Spartacus libraries.

To build the Spartacus project from source, see [Contributor Setup](contributorsetup.md).

# Prerequisites

Before carrying out the procedures below, please ensure the following front end and back end requirements are in place.

## Front end Requirements

Your Angular development environment should include the following:

- Angular cli v7.2.1
- node.js >= 10.14.1
- yarn >= 1.9.4

## Back end Requirements

The Spartacus JavaScript Storefront uses SAP Commerce for its back end, and makes use of the sample data from the B2C Accelerator electronics storefront in particular.

Perform the following steps to set up your back end:

- Install a new instance of SAP Commerce 1808 using the `b2c_acc_plus` recipe, as follows:

   1. In the `installer/recipes` folder of SAP Commerce 1808, make a copy of `b2c_acc_plus` and call it `b2c_for_spartacus`.

   2. Delete the existing `build.gradle` file in the `b2c_for_spartacus` recipe folder. 

   3. Add this [build.gradle](assets/build.gradle) file to your `b2c_for_spartacus` recipe folder.

   4. Follow the instructions in https://help.hybris.com/1808/hcd/8c46c266866910149666a0fe4caeee4e.html to install, initialize and start a new instance of SAP Commerce 1808, using `b2c_for_spartacus` as the recipe name.

- Import `spartacus_sample_data.impex`, which you can download here: https://help.hybris.com/1808/api/spartacus/spartacus_sample_data.impex

  For more information on importing ImpEx, see https://help.hybris.com/1808/hcd/2f095d195c0740aab4b0bbdf0f0a2d12.html. 

- Configure your OCC client, as described here: https://help.hybris.com/1808/hcd/627c92db29ce4fce8b01ffbe478a8b3b.html#loio4079b4327ac243b6b3bd507cda6d74ff

# Creating a New Angular Application

In the following procedure, we create a new Angular application with the name `mystore`.

1. Generate a new Angular application using the Angular CLI, as follows:
   ```
   $ ng new {mystore} --style=scss --routing=true
   ```
2. Access the newly created directory:
   ```
   $ cd {mystore}
   ```

# Adding Peer Dependencies to the Storefront

The dependencies in this procedure are required by the Spartacus storefront.

1. Add the following dependencies to the `dependencies` section of `{mystore}/package.json`:

   ```
   "@angular/pwa": "^0.12.0",
   "@angular/service-worker": "~7.2.0",
   "@ng-bootstrap/ng-bootstrap": "^4.0.1",
   "@ng-select/ng-select": "^2.13.2",
   "@ngrx/effects": "~7.0.0",
   "@ngrx/router-store": "~7.0.0",
   "@ngrx/store": "~7.0.0",
   "bootstrap": "^4.1.3",
   "ngrx-store-localstorage": "^5.1.0",
   ```

2. Install the dependencies. The following is an example using yarn:

   ```
   yarn install
   ```

# Adding the Storefront Dependencies

There are several libraries you must add to your storefront application. You can do so with yarn, as follows:

```
$ yarn add @spartacus/core@next
$ yarn add @spartacus/storefront@next
$ yarn add @spartacus/styles@next
```

The storefront libraries are not yet released, so we suggest using the `@next` tag to install the latest pre-alpha version that is available.

# Importing the Storefront Module into Your Application

1. Open `{mystore}/src/app/app.module.ts` and add the following lines:

   ```
   import { StorefrontModule } from '@spartacus/storefront';
   ```

2. Add the `StorefrontModule` to the import section of the `NgModule` decorator:

   ```
   imports: [BrowserModule, StorefrontModule],
   ```

Your file should look like this:

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StorefrontModule } from '@spartacus/storefront';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, StorefrontModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

# Configuring the Storefront

The Spartacus storefront has default values for all of its configurations. However, you may need to override these values. An example use case would be so that your storefront can communicate with your SAP Commerce back end.

To configure the storefront, use the `withConfig` method on the StorefrontModule. The following is an example:

```
  imports: [
    BrowserModule, StorefrontModule.withConfig({
      server: {
        baseUrl: 'https://electronics.local:9002',
        occPrefix: '/rest/v2/'
      },
      authentication: {
        client_id: 'mobile_android',
        client_secret: 'secret'
      }
    })
  ],
```

This example uses the default values for the configs. You do not have to specify a config if you do not need to override its value. For example, if you only need to override the back end base URL, you can use this config:

```
imports: [BrowserModule, StorefrontModule.withConfig({
  server: {
    baseUrl: 'https://my-custom-backend-url:8080',
  }
})]
```

# Adding the Storefront Component

This procedure adds the storefront component in the UI.

1. Open `{approot}/src/app/app.component.html` and replace the entire contents of the file with the following line:

   ```
   <cx-storefront>Loading...</cx-storefront>
   ```

2. Import the styles from the `@spartacus/styles` library by opening `{approot}/src/styles.scss` and adding the following line:

   ```
   @import "~@spartacus/styles/index";
   ```

# Building and Starting

This section describes how to validate your back end installation, and then start the application with the storefront enabled.

## Validating the Back end

1. Use a web browser (Chrome is highly recommended) to access the CMS OCC endpoint of your back end.

   The default is available at: `{server-base-url}/rest/v2/electronics/cms/pages`.

   For example, with a back end instance running from `https://localhost:9002`, you would access: https://localhost:9002/rest/v2/electronics/cms/pages.

2. Accept the security exception in your browser if you are running a development instance with a self-signed HTTPS certificate.

   When the request works, you see an XML response in your browser.

## Starting the Storefront Application

1. Start the application with the storefront enabled, as follows:

   ```
   $ ng serve
   ```

2. When the app server is properly started, point your browser to http://localhost:4200, as instructed from the terminal output of `ng serve`.

# Known Issues

The following are known issues with the current release of Spartacus JavaScript Storefront:

- When using SAP Commerce 1808 for your back end, you are currently not able to add payment details or address details in the Spartacus storefront, which prevents successful checkout. However, if you add payment and address details through the Accelerator electronics storefront, they will then appear in the Spartacus storefront, and you will be able to check out.

- The Spartacus storefront is currently missing all categories.

- The Spartacus storefront is currently missing the footer.

- Certain AddOns may cause the Spartacus storefront to not work properly.

- Spartacus relies on the `cmsoccaddon` for CMS information. However, this extension is currently not fully compatible with SmartEdit. As a result, the categories may not appear in Spartacus. To avoid this problem, remove the SmartEdit CMS web services and personalization extensions.

- You may notice that the logo is very small. This can be fixed as follows:

  1.  Log in to SAP Commerce Backoffice.

  2.  Select `WCMS` in the left-hand navigation pane, then select the `Component` child node that appears below.

  3.  Search for the term `SiteLogoComponent` in the Search box in the top-center panel.

      You can modify the component directly in the Online Catalog, or you can modify it in the Staged Catalog and then perform a sync.

  4.  Open the `Administration` tab of the SiteLogoComponent, and remove the `Media` value.

  5.  Click the button labelled `...` next to the `Media` field.

  6.  In the pop-up search box that appears, search for the desired media file in your system and select it.

  7.  Save your changes
