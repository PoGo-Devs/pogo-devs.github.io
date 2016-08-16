jQuery("#About div").load("sections/about.html");
jQuery("#Contribute div").load("sections/contribute.html");
jQuery("#footer div").load("sections/footer.html");

//http://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it
function decodeHtml(str) {
    return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10); // read num as normal number
        return String.fromCharCode(num);
    });
}

jQuery.getJSON("https://api.github.com/repos/ST-Apps/PoGo-UWP/releases", function(items) {
    dataMaker = function (dataTime) {
        dataFill = function (dataTime) {
            str = "" + dataTime;
            pad = "00";
            return pad.substring(0, pad.length - str.length) + str;
        }
        //dataTime = dataTime.replace("Z", "").split(/[- :T]/);
        dataTime = new Date(dataTime);
        return dataFill(dataTime.getMonth()+1) + '/' + dataFill(dataTime.getDate()) + '/' + dataTime.getFullYear();
    }
    for (i = 0; i < 5; i++) {
        target = "#Releases .v" + (i + 1);
        name = items[i].name;
        url = items[i].assets[0].browser_download_url;
        published = dataMaker(items[i].published_at);
        changelogHtml = decodeHtml(markdown.toHTML(items[i].body));

        changelogHtml = changelogHtml.replace(/(\* )?((Probably fixed)|(Probably solved)|(Fixed)|(fixed))( -)?/g, "<span class='fix label'>Fixed</span>");
        changelogHtml = changelogHtml.replace(/(\* )?(Added)( -)?/g, "<span class='add label'>Added</span>");
        changelogHtml = changelogHtml.replace(/(\* )?(Updated)( -)?/g, "<span class='update label'>Updated</span>");
        changelogHtml = changelogHtml.replace(/(\* )?(Removed)( -)?/g, "<span class='update label'>Removed</span>");
        changelogHtml = changelogHtml.replace(/(#)([0-9]+)/g, "<a href='https://github.com/ST-Apps/PoGo-UWP/issues/$2' title='Issue $2'>Issue#$2</a>");
        changelogHtml = changelogHtml.replace(/\[(.*)\]\((.*)\)/g, "<a href='$2' title='$1'>$1</a>");

        jQuery(target + " .version").html(name);
        jQuery(target + " .data").html(published);
        jQuery(target + " .release-download a").attr("href", url);
        jQuery(target + " ul").append(changelogHtml);
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
