import { v4 as uuid } from "uuid"
import * as vec from "utils/vec"
import { DotShape, ShapeType } from "types"
import { registerShapeUtils } from "./index"
import { boundsContained } from "utils/bounds"
import { intersectCircleBounds } from "utils/intersections"
import { DotCircle } from "components/canvas/misc"
import { translateBounds } from "utils/utils"

const dot = registerShapeUtils<DotShape>({
  boundsCache: new WeakMap([]),

  create(props) {
    return {
      id: uuid(),
      type: ShapeType.Dot,
      isGenerated: false,
      name: "Dot",
      parentId: "page0",
      childIndex: 0,
      point: [0, 0],
      rotation: 0,
      style: {
        fill: "#c6cacb",
        strokeWidth: "0",
      },
      ...props,
    }
  },

  render({ id }) {
    return <DotCircle id={id} cx={0} cy={0} r={4} />
  },

  applyStyles(shape, style) {
    Object.assign(shape.style, style)
    return this
  },

  getBounds(shape) {
    if (!this.boundsCache.has(shape)) {
      const bounds = {
        minX: 0,
        maxX: 1,
        minY: 0,
        maxY: 1,
        width: 1,
        height: 1,
      }

      this.boundsCache.set(shape, bounds)
    }

    return translateBounds(this.boundsCache.get(shape), shape.point)
  },

  getRotatedBounds(shape) {
    return this.getBounds(shape)
  },

  getCenter(shape) {
    return shape.point
  },

  hitTest(shape, test) {
    return true
  },

  hitTestBounds(this, shape, brushBounds) {
    const shapeBounds = this.getBounds(shape)
    return (
      boundsContained(shapeBounds, brushBounds) ||
      intersectCircleBounds(shape.point, 4, brushBounds).length > 0
    )
  },

  rotateTo(shape) {
    return this
  },

  translateTo(shape, point) {
    shape.point = point
    return this
  },

  transform(shape, bounds) {
    shape.point = [bounds.minX, bounds.minY]

    return this
  },

  transformSingle(shape, bounds, info) {
    this.transform(shape, bounds, info)
    return this
  },

  setParent(shape, parentId) {
    shape.parentId = parentId
    return this
  },

  setChildIndex(shape, childIndex) {
    shape.childIndex = childIndex
    return this
  },

  canTransform: false,
  canChangeAspectRatio: false,
})

export default dot