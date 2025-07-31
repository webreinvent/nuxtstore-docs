---
title: JSON Serializable Documentation 
description: A guide to using the json_serializable package for automated JSON serialization and deserialization in Flutter/Dart, based on example cart models and services.
---

```
./lib
└── data
    ├── models
    │   ├── cart_add_data.dart
    │   ├── cart_add_data.g.dart
    │   ├── cart_products_items.dart
    │   ├── cart_products_items.g.dart
    │   ├── cart_response.dart
    │   └── cart_response.g.dart
    └── services
        ├── cart_service.dart
        └── vaah_cart_service.dart
```


## Introduction to ```json_serializable```

The `json_serializable` package automates the process of converting Dart objects to and from JSON. When working with APIs, you need to encode Dart objects into JSON to send them in request bodies and decode JSON from responses into Dart objects. Writing this conversion logic (often called boilerplate code) manually is tedious and error-prone. `json_serializable` generates this code for you, ensuring it's robust, type-safe, and in sync with your model classes.


## Setting Up a Model Class
To make a Dart class serializable, you need to follow a few key steps. We'll use the CartAddData class as an example.

### Key Points

1. Annotation: Add the``` @JsonSerializable()``` annotation above the class definition. This tells the code generator to process this class. You can pass arguments to customize its behavior, such as `fieldRename: FieldRename.snake`, which automatically maps `snake_case` JSON keys to `camelCase` Dart fields.

2. Part Directive: Include a `part` directive to link your model file with its generated ounterpart. The file name must match and end with .g.dart.

3. fromJson Factory: Create a factory constructor named `fromJson` that takes a `Map<String, dynamic>` and calls the generated function `_$ClassNameFromJson()`. This is the entry point for deserialization.

4. toJson Method: Create a `toJson` method that returns a `Map<String, dynamic>` and calls the generated function `_$ClassNameToJson()`. This is the entry point for serialization.

#### Example: `cart_add_data.dart`
```dart
import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

// 2. Link to the generated file
part 'cart_add_data.g.dart';

/// Model representing data to add to the cart.
// 1. Annotate the class
@JsonSerializable(fieldRename: FieldRename.snake)
class CartAddData extends Equatable {
  // 3. Create the fromJson factory
  factory CartAddData.fromJson(Map<String, dynamic> json) => _$CartAddDataFromJson(json);

  const CartAddData({required this.id, required this.cartProductsCount, required this.uuid});

  final int id;
  // This will be mapped from 'cart_products_count' in JSON
  final int cartProductsCount;
  final String uuid;

  // 4. Create the toJson method
  Map<String, dynamic> toJson() => _$CartAddDataToJson(this);

  @override
  List<Object?> get props => [id, cartProductsCount, uuid];
}
```