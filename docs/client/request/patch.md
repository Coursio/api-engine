# Regular patch command

[Patch commands](crud.md#patch-command) perform a partial modification of
existing models by setting the model with specified values.

This is in contrast with [upsert commands](crud.md#upsert-command) which fully
replace (or create) the models.

```HTTP
PATCH /rest/users/1

{ "city": "Copenhagen" }
```

```json
{
  "data": { "id": "1", "name": "Anthony", "city": "Copenhagen" }
}
```

# Advanced patch command

Advanced [patch commands](crud.md#patch-command) use operators to perform a
transformation on the model's attributes. Operators are objects describing the
transformation to apply as `{ "_OPERATOR": ARGUMENT }`, e.g. `{ "_add": 1 }`.

The example below increments the user's `age` by `1`.

```HTTP
PATCH /rest/users/1

{ "age": { "_add": 1 } }
```

```json
{
  "data": { "id": "1", "name": "Anthony", "age": 31 }
}
```

# Array attributes

Some patch operators are specific to arrays, e.g. `_push` or `_pop`. Others
are specific to scalar attributes, e.g. `_add`.

If a scalar patch operator is applied to an array attribute, it will be applied
to each element of the array.

The example below multiplies each `score`'s element by `100`.

```HTTP
PATCH /rest/users/1

{ "scores": { "_mul": 100 } }
```

```json
{
  "data": { "id": "1", "name": "Anthony", "scores": [200, 300, 800] }
}
```

# Cross-attributes patch

It is possible to refer to another attribute of the same model using the
`model.ATTRIBUTE` notation.

The example below sets the model's `first_name` to the same value as its `name`.

```HTTP
PATCH /rest/users/1

{ "first_name": { "_set": "model.name" } }
```

or the shorter syntax:

```HTTP
PATCH /rest/users/1

{ "first_name": "model.name" }
```

```json
{
  "data": { "id": "1", "name": "Anthony", "first_name": "Anthony" }
}
```

# Available operators

## `_set`

The `_set` operator assigns the value, like `variable = value` in JavaScript.

```HTTP
PATCH /rest/users/1

{ "first_name": { "_set": "Anthony" } }
```

It is the same as [regular patch commands](#regular-patch-command):

```HTTP
PATCH /rest/users/1

{ "first_name": "Anthony" }
```

## `_invert`

The `_invert` operator flips a `boolean` attribute, like `variable = !variable`
in JavaScript. Its argument must always be `null`.

```HTTP
PATCH /rest/users/1

{ "is_manager": { "_invert": null } }
```

## `_add`

The `_add` operator increments a `number` or `integer` attribute, like
`variable += value` in JavaScript.

```HTTP
PATCH /rest/users/1

{ "money": { "_add": 10.5 } }
```

## `_sub`

The `_sub` operator decrements a `number` or `integer` attribute, like
`variable -= value` in JavaScript.

```HTTP
PATCH /rest/users/1

{ "money": { "_sub": 10.5 } }
```

## `_mul`

The `_mul` operator multiplies a `number` or `integer` attribute, like
`variable *= value` in JavaScript.

```HTTP
PATCH /rest/users/1

{ "money": { "_mul": 2 } }
```

## `_div`

The `_div` operator divides a `number` or `integer` attribute, like
`variable /= value` in JavaScript.

```HTTP
PATCH /rest/users/1

{ "money": { "_div": 2 } }
```

## `_replace`

The `_replace` operator replaces a string by another string inside a `string`
attribute, like `variable.replace(regExp, value)` in JavaScript. The argument
must be an array with the following elements:
  - a regular expression, as a string: the pattern to replace
  - the new value, as a string. It can contain the `$1`, `$&`, etc. like
    the `replace()` JavaScript function.
  - the regular expression flags. This is optional and defaults to `gi`

```HTTP
PATCH /rest/article/1

{ "title": { "_replace": ["Anthony", "George"] } }
```

## `_insertstr`

The `_insertstr` operator inserts a string inside a `string` attribute at a
given position. The argument must be an array with the following elements:
  - the position where to insert inside the string, as an integer.
    It can be a positive integer (position from the beginning), a negative
    integer (position from the end) or `null` (i.e. the end).
  - the new value, as a string.

```HTTP
PATCH /rest/article/1

{ "title": { "_insertstr": [null, " text to append"] } }
```

## `_slicestr`

The `_slicestr` operator extracts part of a `string` attribute at a given
start and end position. The argument must be an array with the following
elements:
  - the position where the slice starts inside the string, as an integer.
    It can be a positive integer (position from the beginning), a negative
    integer (position from the end) or `null` (i.e. the end).
  - the position where the slice ends, using the same kind of integer.
    It defaults to the end of the string.

```HTTP
PATCH /rest/article/1

{ "title": { "_slicestr": [0, 100] } }
```

## `_insert`

The `_insert` operator inserts some values inside an `array` attribute at a
given position. The argument must be an array with the following elements:
  - the position where to insert inside the array, as an integer.
    It can be a positive integer (position from the beginning), a negative
    integer (position from the end) or `null` (i.e. the end).
  - the new values, as several arguments.

```HTTP
PATCH /rest/user/1

{ "scores": { "_insert": [5, 100, 500, 300] } }
```

## `_slice`

The `_slice` operator extracts part of an array attribute at a given
start and end position. The argument must be an array with the following
elements:
  - the position where the slice starts inside the array, as an integer.
    It can be a positive integer (position from the beginning), a negative
    integer (position from the end) or `null` (i.e. the end).
  - the position where the slice ends, using the same kind of integer.
    It defaults to the end of the array.

```HTTP
PATCH /rest/user/1

{ "scores": { "_slice": [0, 100] } }
```

## `_push`

The `_push` operator inserts some values at the end of an `array` attribute.
The argument must be the values to insert.

```HTTP
PATCH /rest/user/1

{ "scores": { "_push": [100, 500, 300] } }
```

## `_unshift`

The `_unshift` operator inserts some values at the beginning of an `array`
attribute. The argument must be the values to insert.

```HTTP
PATCH /rest/user/1

{ "scores": { "_unshift": [100, 500, 300] } }
```

## `_pop`

The `_pop` operator removes the last value of an `array` attribute.
The argument must always be `null`.

```HTTP
PATCH /rest/user/1

{ "scores": { "_pop": null } }
```

## `_shift`

The `_shift` operator removes the first value of an `array` attribute.
The argument must always be `null`.

```HTTP
PATCH /rest/user/1

{ "scores": { "_shift": null } }
```

## `_remove`

The `_remove` operator removes values from an `array` attribute.
The argument must be the set of values to remove.

```HTTP
PATCH /rest/user/1

{ "scores": { "_remove": [100, 200, 500] } }
```

## `_sort`

The `_sort` operator sort the values of an `array` attribute.
The argument must be either `asc` or `desc` to specify the sorting order.
It defaults to `asc`.

```HTTP
PATCH /rest/user/1

{ "scores": { "_sort": "asc" } }
```

## Custom operators

Servers can specify additional
[custom operators](../../server/data_model/patch.md).
