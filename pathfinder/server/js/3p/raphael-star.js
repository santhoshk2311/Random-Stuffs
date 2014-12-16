// x and y are the center points of the star, while r is the distance from the center to a point

Raphael.fn.star = function (paper, x, y, r) {
    // start at the top point
    var path = "M" + x + "," + (y - r);
    // let's draw this the way we might by hand, by connecting each point the one two-fifths of the way around the clock
    for (var c = 0; c < 6; c += 1) {
        var angle = 270 + c * 144,
            rx = x + r * Math.cos(angle * Math.PI / 180),
            ry = y + r * Math.sin(angle * Math.PI / 180);

        path += "L" + rx + "," + ry;
    }
    return paper.path(path);
};

//
//paper.star(50, 50, 30);
//
//paper.star(100, 150, 15).attr("fill", "orange");
//
//paper.star(150, 80, 50).attr({
//    fill: "#F90900",
//    'stroke-width': 0
//});