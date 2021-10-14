#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texSampler;
uniform float testAlpha;

varying lowp vec4 vColor;
varying vec2 vTexCoords;

uniform sampler2D palSampler;
uniform float colCount;
uniform vec2 palCount;

void main() {
    vec4 src = texture2D(texSampler, vTexCoords);
    float val = min(src.r, 0.99999);
    
    float paloff = (floor(val * colCount) + 0.5) / colCount;
    paloff *= 1.0 / palCount.x;
    
    float palx = vColor.r * (palCount.x - 1.0) / palCount.x + paloff;
    float paly = ((vColor.g * (palCount.y - 1.0)) + 0.5) / palCount.y;
    
    vec4 frag = texture2D(palSampler, vec2(palx, paly)) * src.a;
    
    frag *= vColor.a;
    if (frag.a <= testAlpha)
        discard;
    gl_FragColor = frag;
}