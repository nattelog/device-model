# Device Model

WebGL 3D model of a phone that can rotate using Euler angles. Its rotation can be set async and the rendering will be controlled using [velocitymodel](https://github.com/whitelizard/velocitymodel).

Install with [npm](www.npmjs.com): `npm install device-model --save`.

```javascript
var DeviceModel = require('device-model');

var model = new DeviceModel('elementId');

model.setEulerAngles(alpha, beta, gamma);
```


## API

#### `DeviceModel(id, width, height, dt)`

Constructor.

**id** `String` ID of the wrapping DOM elementId.

**width** `Number` The width of the render size. Defaults to wrapping element width.

**height** `Number` The height of the render size. Defaults to **width**.

**dt** `Number` The render frequenzy in *ms*. Defaults to 50 ms.


#### `setEulerAngles(alpha, beta, gamma)`

Sets the angles of the model.

**alpha** `Number` The alpha angle in degrees.

**beta** `Number` The beta angle in degrees.

**gamma** `Number` The gamma angle in degrees.


#### `getAxisAngles()`

Returns an object with the model's actual rotation in radians around each axis.
