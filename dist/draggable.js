"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draggable = void 0;
const draggable = (ele) => {
    if (!ele) {
        return;
    }
    let offsetX = 0;
    let offsetY = 0;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    ele.style.cursor = 'grab';
    const onMousedown = (e) => {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - offsetX;
            initialY = e.touches[0].clientY - offsetY;
            window.addEventListener('touchmove', onMouseMove);
            window.addEventListener('touchend', onMouseUp);
        }
        else {
            initialX = e.clientX - offsetX;
            initialY = e.clientY - offsetY;
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
        ele.style.cursor = 'grabbing';
    };
    const onMouseMove = (e) => {
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        }
        else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }
        offsetX = currentX;
        offsetY = currentY;
        ele.style.transform = `translate(${currentX}px, ${currentY}px)`;
    };
    const onMouseUp = (e) => {
        initialX = currentX;
        initialY = currentY;
        if (e.type === 'touchend') {
            window.removeEventListener('touchmove', onMouseMove);
            window.removeEventListener('touchend', onMouseUp);
        }
        else {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        ele.style.cursor = 'grab';
    };
    ele.addEventListener('mousedown', onMousedown);
    ele.addEventListener('touchstart', onMousedown);
    return () => {
        ele.removeEventListener('mousedown', onMousedown);
        ele.removeEventListener('touchstart', onMousedown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchend', onMouseUp);
        window.removeEventListener('touchmove', onMouseMove);
    };
};
exports.draggable = draggable;
