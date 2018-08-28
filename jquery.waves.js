(function ($) {
    $.fn.drawWaves = function (options) {
        const settings = $.extend({
            container: options.container ? options.container : 'body',
            color: '#33ABF9',
            height: 200,
            waveDelta: 100,
            wavePoints: 3,
            speed: .15
        }, options);

        const wave = this;
        let width = $(settings.container).width();
        let height = $(settings.container).height();
        let points = [];
        let lastUpdate;
        let totalTime = 0;

        TweenMax.set(wave, {attr: {fill: settings.color}});

        function drawPoints(factor) {
            const points = [];

            for (let i = 0; i <= settings.wavePoints; i++) {
                const x = i / settings.wavePoints * width;
                const sinSeed = (factor + (i + i % settings.wavePoints)) * settings.speed * 100;
                const sinHeight = Math.sin(sinSeed / 100) * settings.waveDelta;
                const yPos = Math.sin(sinSeed / 100) * sinHeight + settings.height;
                points.push({x: x, y: yPos});
            }

            return points;
        }

        function drawPath(points) {
            let SVGString = 'M ' + points[0].x + ' ' + points[0].y;

            const cp0 = {
                x: (points[1].x - points[0].x) / 2,
                y: (points[1].y - points[0].y) + points[0].y + (points[1].y - points[0].y)
            };

            SVGString += ' C ' + cp0.x + ' ' + cp0.y + ' ' + cp0.x + ' ' + cp0.y + ' ' + points[1].x + ' ' + points[1].y;

            let prevCp = cp0;
            let inverted = -1;

            for (let i = 1; i < points.length - 1; i++) {
                const cpLength = Math.sqrt(prevCp.x * prevCp.x + prevCp.y * prevCp.y);
                const cp1 = {
                    x: (points[i].x - prevCp.x) + points[i].x,
                    y: (points[i].y - prevCp.y) + points[i].y
                };

                SVGString += ' C ' + cp1.x + ' ' + cp1.y + ' ' + cp1.x + ' ' + cp1.y + ' ' + points[i + 1].x + ' ' + points[i + 1].y;
                prevCp = cp1;
                inverted = -inverted;
            }

            SVGString += ' L ' + width + ' ' + height;
            SVGString += ' L 0 ' + height + ' Z';
            return SVGString;
        }

        function draw() {
            const now = window.Date.now();

            if (lastUpdate) {
                const elapsed = (now - lastUpdate) / 1000;
                lastUpdate = now;

                totalTime += elapsed;

                const factor = totalTime * Math.PI;
                TweenMax.to(wave, settings.speed, {
                    attr: {
                        d: drawPath(drawPoints(factor))
                    },
                    ease: Power1.easeInOut
                });
            } else {
                lastUpdate = now;
            }

            requestAnimationFrame(draw);
        }

        function debounce(func, wait, immediate) {
            let timeout;
            return function () {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                }, wait);
                if (immediate && !timeout) func.apply(context, args);
            };
        }

        const redraw = debounce(function () {
            wave.attr('d', '');
            points = [];
            totalTime = 0;
            width = $(settings.container).width();
            height = $(settings.container).height();
            lastUpdate = false;
            setTimeout(function () {
                draw();
            }, 50);
        }, 250);
        $(window).on('resize', redraw);

        return draw();
    };
}(jQuery));
