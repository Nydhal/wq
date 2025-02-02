# Hidden

The `<Hidden/>` [input component][inputs] is entirely invisible, unless there is a validation error specific to the field.  Use `Hidden` when you want a field to be present in the [Serializer] output but not in the form.


```python
# myapp/models.py
from django.db import models

class Survey(models.Model):
    hidden_field = models.CharField(
        max_length=10,
        default=somehow_determine_default,
    )


# myapp/serializers.py
from wq.db.rest.serializers import ModelSerializer
from rest_framework import serializers
from .models import Survey

class SurveySerializer(ModelSerializer):
    class Meta:
        model = Survey
        fields = '__all__'
        wq_field_config = {
            'hidden_field': {'control': {'appearance': 'hidden'}},
        }


# myapp/rest.py
from .models import Survey
from .serializers import SurveySerializer

rest.router.register_model(
    Survey,
    serializer=SurveySerializer,
)
```

## Source

While [@wq/react] defines a [placeholder implementation][react-src], [@wq/material]'s versions are more useful as reference:

 * [Hidden.js (@wq/material)][material-src]
 * [Hidden.native.js (@wq/material)][material-native-src]

[inputs]: ./index.md
[Serializer]: ../wq.db/serializers.md
[@wq/react]: ../@wq/react.md
[@wq/material]: ../@wq/material.md
[react-src]: https://github.com/wq/wq.app/blob/main/packages/react/src/inputs/Hidden.js
[material-src]: https://github.com/wq/wq.app/blob/main/packages/material/src/inputs/Hidden.js
[material-native-src]: https://github.com/wq/wq.app/blob/main/packages/material/src/inputs/Hidden.native.js
