jQuery("#About div").load("https://josefreittas.com/PoGo-UWP/sections/about.html");
jQuery("#Contribute div").load("https://josefreittas.com/PoGo-UWP/sections/contribute.html");
jQuery("#footer div").load("https://josefreittas.com/PoGo-UWP/sections/footer.html");

jQuery.getJSON("https://api.github.com/repos/ST-Apps/PoGo-UWP/releases", function(items) {
    dataMaker = function (dataTime) {
        dataFill = function (dataTime) {
            str = "" + dataTime;
            pad = "00";
            return pad.substring(0, pad.length - str.length) + str;
        }
        dataTime = dataTime.replace("Z", "").split(/[- :T]/);
        dataTime = new Date(dataTime[0], dataTime[1], dataTime[2], dataTime[3], dataTime[4], dataTime[5]);
        return dataFill(dataTime.getMonth()) + '/' + dataFill(dataTime.getDay()) + '/' + dataTime.getFullYear();
    }
    for (i = 0; i < 5; i++) {
        target = "#Releases .v" + (i + 1);
        name = items[i].name;
        url = items[i].assets[0].browser_download_url;
        published = dataMaker(items[i].published_at);
        chagelog = items[i].body.split("\r\n* ");

        jQuery(target + " .version").html(name);
        jQuery(target + " .data").html(published);
        jQuery(target + " .release-download a").attr("href", url);

        for (var li = 0; li < chagelog.length; li++) {
            line = chagelog[li];
            line = line.replace(/^(\* )?((Probably fixed)|(Probably solved)|(Fixed)|(fixed))( -)?/, "<span class='fix'>Fixed</span>");
            line = line.replace(/^(\* )?(Added)( -)?/, "<span class='add'>Added</span>");
            line = line.replace(/^(\* )?(Updated)( -)?/, "<span class='update'>Updated</span>");
            line = line.replace(/^(\* )?(Removed)( -)?/, "<span class='update'>Removed</span>");
            line = line.replace(/(#)([0-9]+)/, "<a href='https://github.com/ST-Apps/PoGo-UWP/issues/$2' title='Issue $2'>Issue#$2</a>");
            line = line.replace(/\[(.*)\]\((.*)\)/, "<a href='$2' title='$1'>$1</a>");
            line = "<li>" + line + "</li>";
            jQuery(target + " ul").append(line);
        }
    }
});

function logShow(button) {
    ul = jQuery(button).parent().find('ul');
    if (ul.css("display") == "none") {
        ul.css("display", "block");
        jQuery(button).html("Hide change log");
    } else {
        ul.css("display", "none");
        jQuery(button).html("Show change log");
    }
}
