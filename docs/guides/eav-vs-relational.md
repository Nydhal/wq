To EAV, or not to EAV? Choosing your data model
===============================================

Once you've [installed wq], you are now ready for the most important step when building an app for citizen science: **defining your data model**.  This step is so important, in fact, that [wq does not do it for you][data model].  Your project needs and topic domain will determine what data model is best for your application.

This article exists to describe one key decision you will need to make - whether to use a traditional [relational model], or to use an [Entity-Attribute-Value] (EAV) model (also commonly referred to as an open schema).  The key difference in the two approaches is the level of flexibility your model has in adapting to changing project requirements, especially when new attribute definitions are needed.  At a high level, attributes are added as *columns* to a relational schema, but as *rows* in an EAV schema.  This means that an EAV schema can be administered via a web-based interface, while a relational schema typically needs to be modified by a database administrator.

One particular strength of an EAV approach is the ability to create "form-builder" or "campaign" driven applications.  Essentially, you can design applications that allow project participants to define their own data collection requirements via an intuitive web-based interface.  [wq is not a form-builder per se][about], but that shouldn't prevent you from using it to make one!

> Note: In [wq.db] (and many other platforms), EAV-style schemas are supported under the hood via the use of relational tables that define a meta-schema.  In addition, these approaches are often mixed within the same project.  So, using an EAV model doesn't exactly mean forgoing a relational schema.  The main goal of this article is to help your determine a high-level strategy for the structure of your data - and especially the time series observations submitted by your project participants.

In this article, we discuss the key features of the relational and EAV models and conclude with a checklist that will hopefully help you decide which is right for you.

## Relational Model
In a relational model, there is typically a one-to-one correspondence between the `<input>` elements in your [HTML form] and the *columns* on the database table you want to populate.  This is much more straightforward than an EAV approach, and (among other things) makes the code and templates easier to read.  Each table can be defined as a [Django model] with specific constraints and requirements that are enforced by Django as well as at the database level.  Relationships between tables can be defined via [ForeignKey] fields, which can be presented as HTML `<select>` menus using the built-in template rendering features of wq.

In wq, the relational approach requires defining one or more [Django model] classes which can then be used to generate [migration scripts] that create the actual database tables.  Once these models are created, they can be registered with the [wq.db REST API] which will make it possible to list, retrieve, create, and update the records in the database through the [default views][views] in the application.  Whenever you add or change a model field, Django can generate a new migration script to make the appropriate modifications to the database.  The [default views][views] will automatically update to the form definition passed through the [wq configuration object][config].

## Entity-Attribute-Value Model

![EAV][eav-image]

In an EAV model, the HTML `<form>` fields represent a one-to-many relationship between a primary `Entity` table and a `Value` table.  Each row in the `Value` table corresponds to a "field", which is defined as a row in a third `Attribute` table.  In effect, the `Value` table creates a many-to-many link between the `Entity` table and the `Attribute` table.  Django does not provide much support for EAV out of the box, though there are a number of plugins that do so.  

Since the `Entity` table is just a regular Django model, regular relational fields can be defined as usual.  A general rule of thumb is that if a field is critical to the interpretation of a record, is a foreign key, or is going to referenced by name anywhere in the code, it should be defined as a traditional relational field.  All other fields can be defined as rows in the `Attribute` table, and new attributes can be added on the fly via a web interface if needed.  When registering an EAV-style model with the [wq.db REST API], you will typically want to use a special [serializer] class from [wq.db.patterns][patterns] to handle the nested records.

The key weakness of the EAV approach is not performance - this can be optimized with appropriate database indices.   Instead, the key weakness of EAV is the level of abstraction that obfuscates the application code.  There will not be a single reference to a specific `Attribute` name anywhere in your code - which makes reasoning about changes more difficult.  That said, if you are comfortable with this abstraction, it can be a very powerful tool for building adaptable applications that don't need any further developer intervention when project definitions change.

## Summary and Examples

Which approach is right for you?  Both are useful, but each have strengths and weaknesses that should be taken into account.

You might want to use a **relational model** if you:

 * have a single, focused project with a targeted participant community
 * have a clearly defined schema that is unlikely to change often
 * are comfortable editing Django model definitions by hand, and redeploying the application, if/when the schema does change
 * have specific validation rules that only apply to certain fields, e.g. "domain" or lookup tables (i.e. ForeignKeys)
 * want precise control over the layout of your forms
 * are adding a wq-powered app to an existing project (i.e. the schema has already been defined)
 * are still unsure about the practical difference between Relational and EAV models.  The relational approach is much easier to get working and is a safe choice overall.

The [Species Tracker] demo is an example of an app that uses a primarily relational model for the time series table (see the [Species Tracker model definitions]).

You might want to use an **EAV model** if you:

 * want to support multiple projects and a broad community with a single "form-builder" or "campaign" application
 * have a loose schema that is likely to change over time
 * want to deploy once (or as infrequently as possible), and want to avoid needing to modify the database schema and templates every time the project definition changes
 * have relatively loose data validation requirements, or are willing enforce them after the fact e.g. through data filters
 * don't need precise control over the layout of your forms, or are willing to implement lots of branching logic in your templates
 * are starting a new project and have full control over the schema
 * already know that this the direction you want to go

If you know you want an EAV structure and are working with time series data, you may be interested in [vera], which is an implementation of ERAV, an extension to EAV with enhanced support for [provenance tracking] and bulk data import (i.e. from Excel).  Otherwise, you can always create your own EAV structure using the methods discussed in this guide:

[How To: Implement Repeating Nested Forms][nested-forms]

The [Try WQ] demo is an example of an app that uses a primarily EAV model for the time series table (see the [Try WQ model definitions] as well as the [vera model definitions]).  This is what makes it possible for participants to define [custom campaigns] on the fly.

[installed wq]: ../overview/setup.md
[data model]: ./describe-your-data-model.md
[about]: ../overview/intro.md
[patterns]: ../wq.db/patterns.md
[relational model]: https://en.wikipedia.org/wiki/Relational_model
[Entity-Attribute-Value]: https://en.wikipedia.org/wiki/Entity-attribute-value_model
[wq.db]: ../wq.db/index.md
[provenance tracking]: https://andrewsheppard.net/research/provenance-volunteer-monitoring/
[HTML form]: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms
[Django model]: https://docs.djangoproject.com/en/1.8/topics/db/models/
[ForeignKey]: https://docs.djangoproject.com/en/1.8/ref/models/fields/#django.db.models.ForeignKey
[migration scripts]: https://docs.djangoproject.com/en/1.8/ref/django-admin/#django-admin-migrate
[wq.db REST API]: ../wq.db/rest.md
[views]: ../views/index.md
[config]: ../wq-configuration-object.md
[eav-image]: ./eav-vs-relational/eav.png
[serializer]: ../wq.db/serializers.md
[patterns]: ../wq.db/patterns.md

[Species Tracker]: https://github.com/powered-by-wq/species.wq.io
[Species Tracker model definitions]: https://github.com/powered-by-wq/species.wq.io/blob/master/db/reports/models.py
[vera]: https://github.com/powered-by-wq/vera
[nested-forms]: ./implement-repeating-nested-forms.md
[Try WQ]: https://github.com/powered-by-wq/try.wq.io
[Try WQ model definitions]: https://github.com/powered-by-wq/try.wq.io/blob/master/db/campaigns/models.py
[vera model definitions]: https://github.com/powered-by-wq/vera/blob/master/vera/models.py
[custom campaigns]: https://try.wq.io/campaigns/new
