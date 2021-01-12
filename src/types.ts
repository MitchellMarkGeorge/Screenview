export interface RemoteEventPayload {
    clientX?: number
    clientY?: number
    elementWidth?:number
    elementHeight?: number
    key?: string
    mouseClickType?: string
    type: "mousemove" | "mousedown" | "keydown"
}