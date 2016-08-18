// Function to show log from release on a onclick
function toggleContent(button) {
    content = jQuery(button).parent().find('.content');
    show = jQuery(button).parent().find('.show');
    hide = jQuery(button).parent().find('.hide');
    if (content.css("display") == "none") {
        content.css("display", "block");
        show.css("display", "none");
        hide.css("display", "inline-block");
    } else {
        content.css("display", "none");
        show.css("display", "inline-block");
        hide.css("display", "none");
    }
}

// Funcition to modelate dates
function dataMaker(dataTime, dataFormat = "m/d/Y") {
    dataFill = function (dataTime) {
        str = "" + dataTime;
        pad = "00";
        return pad.substring(0, pad.length - str.length) + str;
    }
    dataTime = new Date(dataTime);
    dataFormat = dataFormat.split("/");
    dataElements = {
        m: dataFill(dataTime.getMonth()+1),
        d: dataFill(dataTime.getDate()),
        Y: dataTime.getFullYear()
    };
    return dataElements[dataFormat[0]] + "/" + dataElements[dataFormat[1]]  + "/" + dataElements[dataFormat[2]] 
}

// Turns markdown in html
function markdownToHtml(str) {
    str = markdown.toHTML(str);
    return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10); // read num as normal number
        return String.fromCharCode(num);
    });
}

function htmlLoad() {
    
    // Get user language
    if (navigator.browserLanguage) { language = navigator.browserLanguage; }
    if (navigator.language) { language = navigator.language; }

    // Change user language if it access by a link from another language
    if (window.location.href.search("#") != -1) { var ancora = window.location.href.split("#")[1]; } else { ancora = ""; }
    if (ancora.search("-") == 2 && ancora.length == 5) { language = ancora; }

    language = language.split("-");
    lang = language[0].toLowerCase();
    variant = language[1].toUpperCase();
    language = lang + "-" + variant;

    locales = "locales/" + language;

    // Load sections
    jQuery.get(locales + "/about.md", function(data) {
        about = markdownToHtml(data);
        jQuery("#About div").html(about);
    }, 'text');
    jQuery.get(locales + "/instructions.md", function(data) {
        instructions = markdownToHtml(data);
        jQuery("#Instructions div").html(instructions);
    }, 'text');
    jQuery.get(locales + "/contribute.md", function(data) {
        contribute = markdownToHtml(data);
        jQuery("#Contribute div").html(contribute);
    }, 'text');
    jQuery.get(locales + "/footer.md", function(data) {
        footer = markdownToHtml(data);
        jQuery("#Footer .content").html(footer);
    }, 'text');

    // Load releases
    jQuery.getJSON("https://api.github.com/repos/ST-Apps/PoGo-UWP/releases", function(items) {
        for (i = 0; i < 5; i++) {

            // Add changlog tags
            changelogHtml = markdownToHtml(items[i].body);
            changelogHtml = changelogHtml.replace(/(\* )?((Probably fixed)|(Probably solved)|(Fixed)|(fixed))( -)?/g, "<span class='fix label'>Fixed</span>");
            changelogHtml = changelogHtml.replace(/(\* )?(Added)( -)?/g, "<span class='add label'>Added</span>");
            changelogHtml = changelogHtml.replace(/(\* )?((Updated)|(Changed))( -)?/g, "<span class='update label'>Updated</span>");
            changelogHtml = changelogHtml.replace(/(\* )?(Removed)( -)?/g, "<span class='remove label'>Removed</span>");
            changelogHtml = changelogHtml.replace(/(\* )?((Improved)|(Revamped))( -)?/g, "<span class='improved label'>Improved</span>");
            changelogHtml = changelogHtml.replace(/(#)([0-9]+)/g, "<a href='https://github.com/ST-Apps/PoGo-UWP/issues/$2' title='Issue $2'>Issue#$2</a>");
            changelogHtml = changelogHtml.replace(/\[(.*)\]\((.*)\)/g, "<a href='$2' title='$1'>$1</a>");
            
            
            // Makes the data entry in HTML.
            target = "#Releases .v" + (i + 1);
            
            assets = items[i].assets;
            for (a = 0; a < assets.length; a++) {
                assetName = items[i].assets[a].name;
                assetUrl = items[i].assets[a].browser_download_url;
                jQuery(target + " .downloads .content").append("<a href='" + assetUrl + "' title='" + assetName + "'>" + assetName + "</a><br>");
            }
            
            jQuery(target + " .version").html(items[i].name);
            jQuery(target + " .data").html(dataMaker(items[i].published_at));
            jQuery(target + " .log .content").append(changelogHtml);
        }
    })

    // Do the language change if load of releases is done
    .done(function () {
        jQuery.getJSON(locales + "/template.json", function(items) {
            jQuery('[data-internationalize]').html(function() {
                type = this.nodeName.toLowerCase();
                data = jQuery(this).data("internationalize");
                if (data != "date-format") {
                    if (type == "a") {
                        jQuery(this).attr("title", items[data]);
                        return items[data];
                    } else if(type == "img") {
                        jQuery(this).attr("alt", items[data]);
                    } else {
                        return items[data];
                    }
                } else {
                    newDate = jQuery(this).html().replace("/", "-").replace("/", "-");
                    newDate = dataMaker(newDate, items["date-format"]);
                    jQuery(this).html(newDate);
                }
            });
        });
    });
}
    
htmlLoad();