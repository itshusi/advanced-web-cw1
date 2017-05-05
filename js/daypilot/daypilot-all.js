﻿/*
DayPilot Lite
Copyright (c) 2005 - 2016 Annpoint s.r.o.
http://www.daypilot.org/
Licensed under Apache Software License 2.0
Version: 192-lite
*/
if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
(function() {
    if (typeof DayPilot.$ !== 'undefined') {
        return;
    };
    DayPilot.$ = function(id) {
        return document.getElementById(id);
    };
    DayPilot.isKhtml = (navigator && navigator.userAgent && navigator.userAgent.indexOf("KHTML") !== -1);
    DayPilot.isIE = (navigator && navigator.userAgent && navigator.userAgent.indexOf("MSIE") !== -1);
    DayPilot.mo2 = function($a, ev) {
        ev = ev || window.event;
        if (typeof(ev.offsetX) !== 'undefined') {
            var $b = {
                x: ev.offsetX + 1,
                y: ev.offsetY + 1
            };
            if (!$a) {
                return $b;
            };
            var $c = ev.srcElement;
            while ($c && $c !== $a) {
                if ($c.tagName !== 'SPAN') {
                    $b.x += $c.offsetLeft;
                    if ($c.offsetTop > 0) {
                        $b.y += $c.offsetTop - $c.scrollTop;
                    }
                };
                $c = $c.offsetParent;
            };
            if ($c) {
                return $b;
            };
            return null;
        };
        if (typeof(ev.layerX) !== 'undefined') {
            var $b = {
                x: ev.layerX,
                y: ev.layerY,
                $d: ev.target
            };
            if (!$a) {
                return $b;
            };
            var $c = ev.target;
            while ($c && $c.style.position !== 'absolute' && $c.style.position !== 'relative') {
                $c = $c.parentNode;
                if (DayPilot.isKhtml) {
                    $b.y += $c.scrollTop;
                }
            }
            while ($c && $c !== $a) {
                $b.x += $c.offsetLeft;
                $b.y += $c.offsetTop - $c.scrollTop;
                $c = $c.offsetParent;
            };
            if ($c) {
                return $b;
            };
            return null;
        };
        return null;
    };
    DayPilot.mo3 = function($a, ev, $e) {
        ev = ev || window.event;
        if (typeof(ev.pageX) !== 'undefined') {
            var $f = DayPilot.abs($a, $e);
            var $b = {
                x: ev.pageX - $f.x,
                y: ev.pageY - $f.y
            };
            return $b;
        };
        return DayPilot.mo2($a, ev);
    };
    DayPilot.browser = {};
    DayPilot.browser.ie9 = (function() {
        var $g = document.createElement("div");
        $g.innerHTML = "<!--[if IE 9]><i></i><![endif]-->";
        var $h = ($g.getElementsByTagName("i").length === 1);
        return $h;
    })();
    DayPilot.browser.ielt9 = (function() {
        var $g = document.createElement("div");
        $g.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->";
        var $h = ($g.getElementsByTagName("i").length === 1);
        return $h;
    })();
    DayPilot.abs = function(element, $i) {
        if (!element) {
            return null;
        };
        var r = {
            x: element.offsetLeft,
            y: element.offsetTop,
            w: element.clientWidth,
            h: element.clientHeight,
            toString: function() {
                return "x:" + this.x + " y:" + this.y + " w:" + this.w + " h:" + this.h;
            }
        };
        if (element.getBoundingClientRect) {
            var b = element.getBoundingClientRect();
            r.x = b.left;
            r.y = b.top;
            var d = DayPilot.doc();
            r.x -= d.clientLeft || 0;
            r.y -= d.clientTop || 0;
            var $j = DayPilot.pageOffset();
            r.x += $j.x;
            r.y += $j.y;
            if ($i) {
                var $k = DayPilot.absOffsetBased(element, false);
                var $i = DayPilot.absOffsetBased(element, true);
                r.x += $i.x - $k.x;
                r.y += $i.y - $k.y;
                r.w = $i.w;
                r.h = $i.h;
            };
            return r;
        } else {
            return DayPilot.absOffsetBased(element, $i);
        }
    };
    DayPilot.absOffsetBased = function(element, $i) {
        var r = {
            x: element.offsetLeft,
            y: element.offsetTop,
            w: element.clientWidth,
            h: element.clientHeight,
            toString: function() {
                return "x:" + this.x + " y:" + this.y + " w:" + this.w + " h:" + this.h;
            }
        };
        while (element.offsetParent) {
            element = element.offsetParent;
            r.x -= element.scrollLeft;
            r.y -= element.scrollTop;
            if ($i) {
                if (r.x < 0) {
                    r.w += r.x;
                    r.x = 0;
                };
                if (r.y < 0) {
                    r.h += r.y;
                    r.y = 0;
                };
                if (element.scrollLeft > 0 && r.x + r.w > element.clientWidth) {
                    r.w -= r.x + r.w - element.clientWidth;
                };
                if (element.scrollTop && r.y + r.h > element.clientHeight) {
                    r.h -= r.y + r.h - element.clientHeight;
                }
            };
            r.x += element.offsetLeft;
            r.y += element.offsetTop;
        };
        var $j = DayPilot.pageOffset();
        r.x += $j.x;
        r.y += $j.y;
        return r;
    };
    DayPilot.sheet = function() {
        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        if (!style.styleSheet) {
            style.appendChild(document.createTextNode(""));
        };
        var h = document.head || document.getElementsByTagName('head')[0];
        h.appendChild(style);
        var $l = !!style.styleSheet;
        var $m = {};
        $m.rules = [];
        $m.commit = function() {
            if ($l) {
                style.styleSheet.cssText = this.rules.join("\n");
            }
        };
        $m.add = function($n, $o, $p) {
            if ($l) {
                this.rules.push($n + "{" + $o + "\u007d");
                return;
            };
            if (style.sheet.insertRule) {
                style.sheet.insertRule($n + "{" + $o + "\u007d", $p);
            } else if (style.sheet.addRule) {
                style.sheet.addRule($n, $o, $p);
            }
        };
        return $m;
    };
    DayPilot.doc = function() {
        var de = document.documentElement;
        return (de && de.clientHeight) ? de : document.body;
    };
    DayPilot.guid = function() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return ("" + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };
    DayPilot.pageOffset = function() {
        if (typeof pageXOffset !== 'undefined') {
            return {
                x: pageXOffset,
                y: pageYOffset
            };
        };
        var d = DayPilot.doc();
        return {
            x: d.scrollLeft,
            y: d.scrollTop
        };
    };
    DayPilot.indexOf = function($q, $r) {
        if (!$q || !$q.length) {
            return -1;
        };
        for (var i = 0; i < $q.length; i++) {
            if ($q[i] === $r) {
                return i;
            }
        };
        return -1;
    };
    DayPilot.mc = function(ev) {
        if (ev.pageX || ev.pageY) {
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        };
        return {
            x: ev.clientX + document.documentElement.scrollLeft,
            y: ev.clientY + document.documentElement.scrollTop
        };
    };
    DayPilot.Stats = {};
    DayPilot.Stats.eventObjects = 0;
    DayPilot.Stats.dateObjects = 0;
    DayPilot.Stats.cacheHitsCtor = 0;
    DayPilot.Stats.cacheHitsParsing = 0;
    DayPilot.Stats.cacheHitsTicks = 0;
    DayPilot.Stats.print = function() {
        console.log("DayPilot.Stats.eventObjects: " + DayPilot.Stats.eventObjects);
        console.log("DayPilot.Stats.dateObjects: " + DayPilot.Stats.dateObjects);
        console.log("DayPilot.Stats.cacheHitsCtor: " + DayPilot.Stats.cacheHitsCtor);
        console.log("DayPilot.Stats.cacheHitsParsing: " + DayPilot.Stats.cacheHitsParsing);
        console.log("DayPilot.Stats.cacheHitsTicks: " + DayPilot.Stats.cacheHitsTicks);
        console.log("DayPilot.Date.Cache.Ctor keys: " + Object.keys(DayPilot.Date.Cache.Ctor).length);
        console.log("DayPilot.Date.Cache.Parsing keys: " + Object.keys(DayPilot.Date.Cache.Parsing).length);
    };
    DayPilot.re = function(el, ev, $s) {
        if (el.addEventListener) {
            el.addEventListener(ev, $s, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + ev, $s);
        }
    };
    DayPilot.pu = function(d) {
        var a = d.attributes,
            i, l, n;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                if (!a[i]) {
                    continue;
                };
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        };
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                var $t = DayPilot.pu(d.childNodes[i]);
            }
        }
    };
    DayPilot.de = function(e) {
        if (!e) {
            return;
        };
        e.parentNode && e.parentNode.removeChild(e);
    };
    DayPilot.sw = function(element) {
        if (!element) {
            return 0;
        };
        return element.offsetWidth - element.clientWidth;
    };
    DayPilot.am = function() {
        if (typeof angular === "undefined") {
            return null;
        };
        if (!DayPilot.am.cached) {
            DayPilot.am.cached = angular.module("daypilot", []);
        };
        return DayPilot.am.cached;
    };
    DayPilot.Selection = function($u, end, $v, $w) {
        this.type = 'selection';
        this.start = $u.isDayPilotDate ? $u : new DayPilot.Date($u);
        this.end = end.isDayPilotDate ? end : new DayPilot.Date(end);
        this.resource = $v;
        this.root = $w;
        this.toJSON = function($x) {
            var $y = {};
            $y.start = this.start;
            $y.end = this.end;
            $y.resource = this.resource;
            return $y;
        };
    };
    DayPilot.request = function($z, $A, $B, $C) {
        var $D = DayPilot.createXmlHttp();
        if (!$D) {
            return;
        };
        $D.open("POST", $z, true);
        $D.setRequestHeader('Content-type', 'text/plain');
        $D.onreadystatechange = function() {
            if ($D.readyState !== 4) return;
            if ($D.status !== 200 && $D.status !== 304) {
                if ($C) {
                    $C($D);
                } else {
                    if (console) {
                        console.log('HTTP error ' + $D.status);
                    }
                };
                return;
            };
            $A($D);
        };
        if ($D.readyState === 4) {
            return;
        };
        if (typeof $B === 'object') {
            $B = DayPilot.JSON.stringify($B);
        };
        $D.send($B);
    };
    DayPilot.createXmlHttp = function() {
        var $E;
        try {
            $E = new XMLHttpRequest();
        } catch (e) {
            try {
                $E = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        };
        return $E;
    };
    DayPilot.Util = {};
    DayPilot.Util.addClass = function($r, name) {
        if (!$r) {
            return;
        };
        if (!$r.className) {
            $r.className = name;
            return;
        };
        var $F = new RegExp("(^|\\s)" + name + "($|\\s)");
        if (!$F.test($r.className)) {
            $r.className = $r.className + ' ' + name;
        }
    };
    DayPilot.Util.removeClass = function($r, name) {
        if (!$r) {
            return;
        };
        var $F = new RegExp("(^|\\s)" + name + "($|\\s)");
        $r.className = $r.className.replace($F, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
    DayPilot.Util.isNullOrUndefined = function($G) {
        return $G === null || typeof $G === "undefined";
    };
    DayPilot.Locale = function(id, $H) {
        this.id = id;
        this.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.dayNamesShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.datePattern = "M/d/yyyy";
        this.timePattern = "H:mm";
        this.dateTimePattern = "M/d/yyyy H:mm";
        this.timeFormat = "Clock12Hours";
        this.weekStarts = 0;
        if ($H) {
            for (var name in $H) {
                this[name] = $H[name];
            }
        }
    };
    DayPilot.Locale.all = {};
    DayPilot.Locale.find = function(id) {
        if (!id) {
            return null;
        };
        var $I = id.toLowerCase();
        if ($I.length > 2) {
            $I[2] = '-';
        };
        return DayPilot.Locale.all[$I];
    };
    DayPilot.Locale.register = function($J) {
        DayPilot.Locale.all[$J.id] = $J;
    };
    DayPilot.Locale.register(new DayPilot.Locale('ca-es', {
        'dayNames': ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'],
        'dayNamesShort': ['dg', 'dl', 'dt', 'dc', 'dj', 'dv', 'ds'],
        'monthNames': ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre', ''],
        'monthNamesShort': ['gen.', 'febr.', 'març', 'abr.', 'maig', 'juny', 'jul.', 'ag.', 'set.', 'oct.', 'nov.', 'des.', ''],
        'timePattern': 'H:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('cs-cz', {
        'dayNames': ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
        'dayNamesShort': ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
        'monthNames': ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec', ''],
        'monthNamesShort': ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', ''],
        'timePattern': 'H:mm',
        'datePattern': 'd. M. yyyy',
        'dateTimePattern': 'd. M. yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('da-dk', {
        'dayNames': ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
        'dayNamesShort': ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
        'monthNames': ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december', ''],
        'monthNamesShort': ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd-MM-yyyy',
        'dateTimePattern': 'dd-MM-yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('de-at', {
        'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        'dayNamesShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        'monthNames': ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''],
        'monthNamesShort': ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('de-ch', {
        'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        'dayNamesShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        'monthNames': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''],
        'monthNamesShort': ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('de-de', {
        'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        'dayNamesShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        'monthNames': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''],
        'monthNamesShort': ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('de-lu', {
        'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        'dayNamesShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        'monthNames': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''],
        'monthNamesShort': ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('en-au', {
        'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
        'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''],
        'timePattern': 'h:mm tt',
        'datePattern': 'd/MM/yyyy',
        'dateTimePattern': 'd/MM/yyyy h:mm tt',
        'timeFormat': 'Clock12Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('en-ca', {
        'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
        'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''],
        'timePattern': 'h:mm tt',
        'datePattern': 'yyyy-MM-dd',
        'dateTimePattern': 'yyyy-MM-dd h:mm tt',
        'timeFormat': 'Clock12Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('en-gb', {
        'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
        'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('en-us', {
        'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
        'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''],
        'timePattern': 'h:mm tt',
        'datePattern': 'M/d/yyyy',
        'dateTimePattern': 'M/d/yyyy h:mm tt',
        'timeFormat': 'Clock12Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('es-es', {
        'dayNames': ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        'dayNamesShort': ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        'monthNames': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', ''],
        'monthNamesShort': ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.', ''],
        'timePattern': 'H:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('es-mx', {
        'dayNames': ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        'dayNamesShort': ['do.', 'lu.', 'ma.', 'mi.', 'ju.', 'vi.', 'sá.'],
        'monthNames': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', ''],
        'monthNamesShort': ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.', ''],
        'timePattern': 'hh:mm tt',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy hh:mm tt',
        'timeFormat': 'Clock12Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('eu-es', {
        'dayNames': ['igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata'],
        'dayNamesShort': ['ig', 'al', 'as', 'az', 'og', 'or', 'lr'],
        'monthNames': ['urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua', ''],
        'monthNamesShort': ['urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.', 'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.', ''],
        'timePattern': 'H:mm',
        'datePattern': 'yyyy/MM/dd',
        'dateTimePattern': 'yyyy/MM/dd H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('fi-fi', {
        'dayNames': ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
        'dayNamesShort': ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],
        'monthNames': ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu', ''],
        'monthNamesShort': ['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu', ''],
        'timePattern': 'H:mm',
        'datePattern': 'd.M.yyyy',
        'dateTimePattern': 'd.M.yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('fr-be', {
        'dayNames': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        'dayNamesShort': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'],
        'monthNames': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ''],
        'monthNamesShort': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd-MM-yy',
        'dateTimePattern': 'dd-MM-yy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('fr-ch', {
        'dayNames': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        'dayNamesShort': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'],
        'monthNames': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ''],
        'monthNamesShort': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('fr-fr', {
        'dayNames': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        'dayNamesShort': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'],
        'monthNames': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ''],
        'monthNamesShort': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('fr-lu', {
        'dayNames': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        'dayNamesShort': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'],
        'monthNames': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ''],
        'monthNamesShort': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('gl-es', {
        'dayNames': ['domingo', 'luns', 'martes', 'mércores', 'xoves', 'venres', 'sábado'],
        'dayNamesShort': ['do', 'lu', 'ma', 'mé', 'xo', 've', 'sá'],
        'monthNames': ['xaneiro', 'febreiro', 'marzo', 'abril', 'maio', 'xuño', 'xullo', 'agosto', 'setembro', 'outubro', 'novembro', 'decembro', ''],
        'monthNamesShort': ['xan', 'feb', 'mar', 'abr', 'maio', 'xuño', 'xul', 'ago', 'set', 'out', 'nov', 'dec', ''],
        'timePattern': 'H:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('it-it', {
        'dayNames': ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
        'dayNamesShort': ['do', 'lu', 'ma', 'me', 'gi', 've', 'sa'],
        'monthNames': ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre', ''],
        'monthNamesShort': ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('it-ch', {
        'dayNames': ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
        'dayNamesShort': ['do', 'lu', 'ma', 'me', 'gi', 've', 'sa'],
        'monthNames': ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre', ''],
        'monthNamesShort': ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('ja-jp', {
        'dayNames': ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        'dayNamesShort': ['日', '月', '火', '水', '木', '金', '土'],
        'monthNames': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ''],
        'monthNamesShort': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ''],
        'timePattern': 'H:mm',
        'datePattern': 'yyyy/MM/dd',
        'dateTimePattern': 'yyyy/MM/dd H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('nb-no', {
        'dayNames': ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
        'dayNamesShort': ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
        'monthNames': ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember', ''],
        'monthNamesShort': ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('nl-nl', {
        'dayNames': ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
        'dayNamesShort': ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
        'monthNames': ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december', ''],
        'monthNamesShort': ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'd-M-yyyy',
        'dateTimePattern': 'd-M-yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('nl-be', {
        'dayNames': ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
        'dayNamesShort': ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
        'monthNames': ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december', ''],
        'monthNamesShort': ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec', ''],
        'timePattern': 'H:mm',
        'datePattern': 'd/MM/yyyy',
        'dateTimePattern': 'd/MM/yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('nn-no', {
        'dayNames': ['søndag', 'måndag', 'tysdag', 'onsdag', 'torsdag', 'fredag', 'laurdag'],
        'dayNamesShort': ['sø', 'må', 'ty', 'on', 'to', 'fr', 'la'],
        'monthNames': ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember', ''],
        'monthNamesShort': ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('pt-br', {
        'dayNames': ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
        'dayNamesShort': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        'monthNames': ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', ''],
        'monthNamesShort': ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('pl-pl', {
        'dayNames': ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
        'dayNamesShort': ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
        'monthNames': ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień', ''],
        'monthNamesShort': ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'yyyy-MM-dd',
        'dateTimePattern': 'yyyy-MM-dd HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('pt-pt', {
        'dayNames': ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
        'dayNamesShort': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        'monthNames': ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', ''],
        'monthNamesShort': ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('ro-ro', {
        'dayNames': ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
        'dayNamesShort': ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
        'monthNames': ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie', ''],
        'monthNamesShort': ['ian.', 'feb.', 'mar.', 'apr.', 'mai.', 'iun.', 'iul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.', ''],
        'timePattern': 'H:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('ru-ru', {
        'dayNames': ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        'dayNamesShort': ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        'monthNames': ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', ''],
        'monthNamesShort': ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек', ''],
        'timePattern': 'H:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('sk-sk', {
        'dayNames': ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'],
        'dayNamesShort': ['ne', 'po', 'ut', 'st', 'št', 'pi', 'so'],
        'monthNames': ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december', ''],
        'monthNamesShort': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ''],
        'timePattern': 'H:mm',
        'datePattern': 'd.M.yyyy',
        'dateTimePattern': 'd.M.yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('sv-se', {
        'dayNames': ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
        'dayNamesShort': ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö'],
        'monthNames': ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december', ''],
        'monthNamesShort': ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'yyyy-MM-dd',
        'dateTimePattern': 'yyyy-MM-dd HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('tr-tr', {
        'dayNames': ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        'dayNamesShort': ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
        'monthNames': ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık', ''],
        'monthNamesShort': ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'd.M.yyyy',
        'dateTimePattern': 'd.M.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('zh-cn', {
        'dayNames': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        'dayNamesShort': ['日', '一', '二', '三', '四', '五', '六'],
        'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', ''],
        'monthNamesShort': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ''],
        'timePattern': 'H:mm',
        'datePattern': 'yyyy/M/d',
        'dateTimePattern': 'yyyy/M/d H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.US = DayPilot.Locale.find("en-us");
    DayPilot.Date = function($K, $L) {
        if ($K instanceof DayPilot.Date) {
            return $K;
        };
        var $M;
        if (DayPilot.Util.isNullOrUndefined($K)) {
            $M = DayPilot.DateUtil.fromLocal().getTime();
            $K = $M;
        };
        var $N = DayPilot.Date.Cache.Ctor;
        if ($N[$K]) {
            DayPilot.Stats.cacheHitsCtor += 1;
            return $N[$K];
        };
        var $O = false;
        if (typeof $K === "string") {
            $M = DayPilot.DateUtil.fromStringSortable($K, $L).getTime();
            $O = true;
        } else if (typeof $K === "number") {
            if (isNaN($K)) {
                throw "Cannot create DayPilot.Date from NaN";
            };
            $M = $K;
        } else if ($K instanceof Date) {
            if ($L) {
                $M = DayPilot.DateUtil.fromLocal($K).getTime();
            } else {
                $M = $K.getTime();
            }
        } else {
            throw "Unrecognized parameter: use Date, number or string in ISO 8601 format";
        };
        var $P = ticksToSortable($M);
        if ($N[$P]) {
            return $N[$P];
        };
        $N[$P] = this;
        $N[$M] = this;
        if ($O && $P !== $K && DayPilot.DateUtil.hasTzSpec($K)) {
            $N[$K] = this;
        };
        if (Object.defineProperty && !DayPilot.browser.ielt9) {
            Object.defineProperty(this, "ticks", {
                get: function() {
                    return $M;
                }
            });
            Object.defineProperty(this, "value", {
                "value": $P,
                "writable": false,
                "enumerable": true
            });
        } else {
            this.ticks = $M;
            this.value = $P;
        };
        if (DayPilot.Date.Config.legacyShowD) {
            this.d = new Date($M);
        };
        DayPilot.Stats.dateObjects += 1;
    };
    DayPilot.Date.Config = {};
    DayPilot.Date.Config.legacyShowD = false;
    DayPilot.Date.Cache = {};
    DayPilot.Date.Cache.Parsing = {};
    DayPilot.Date.Cache.Ctor = {};
    DayPilot.Date.Cache.Ticks = {};
    DayPilot.Date.prototype.addDays = function($Q) {
        return new DayPilot.Date(this.ticks + $Q * 24 * 60 * 60 * 1000);
    };
    DayPilot.Date.prototype.addHours = function($R) {
        return this.addTime($R * 60 * 60 * 1000);
    };
    DayPilot.Date.prototype.addMilliseconds = function($S) {
        return this.addTime($S);
    };
    DayPilot.Date.prototype.addMinutes = function($T) {
        return this.addTime($T * 60 * 1000);
    };
    DayPilot.Date.prototype.addMonths = function($U) {
        var $K = new Date(this.ticks);
        if ($U === 0) return this;
        var y = $K.getUTCFullYear();
        var m = $K.getUTCMonth() + 1;
        if ($U > 0) {
            while ($U >= 12) {
                $U -= 12;
                y++;
            };
            if ($U > 12 - m) {
                y++;
                m = $U - (12 - m);
            } else {
                m += $U;
            }
        } else {
            while ($U <= -12) {
                $U += 12;
                y--;
            };
            if (m + $U <= 0) {
                y--;
                m = 12 + m + $U;
            } else {
                m = m + $U;
            }
        };
        var d = new Date($K.getTime());
        d.setUTCDate(1);
        d.setUTCFullYear(y);
        d.setUTCMonth(m - 1);
        var $V = new DayPilot.Date(d).daysInMonth();
        d.setUTCDate(Math.min($V, $K.getUTCDate()));
        return new DayPilot.Date(d);
    };
    DayPilot.Date.prototype.addSeconds = function($W) {
        return this.addTime($W * 1000);
    };
    DayPilot.Date.prototype.addTime = function($M) {
        return new DayPilot.Date(this.ticks + $M);
    };
    DayPilot.Date.prototype.addYears = function($X) {
        var $Y = new Date(this.ticks);
        var d = new Date(this.ticks);
        var y = this.getYear() + $X;
        var m = this.getMonth();
        d.setUTCDate(1);
        d.setUTCFullYear(y);
        d.setUTCMonth(m);
        var $V = new DayPilot.Date(d).daysInMonth();
        d.setUTCDate(Math.min($V, $Y.getUTCDate()));
        return new DayPilot.Date(d);
    };
    DayPilot.Date.prototype.dayOfWeek = function() {
        return new Date(this.ticks).getUTCDay();
    };
    DayPilot.Date.prototype.getDayOfWeek = function() {
        return new Date(this.ticks).getUTCDay();
    };
    DayPilot.Date.prototype.daysInMonth = function() {
        var $K = new Date(this.ticks);
        var $Z = $K.getUTCMonth() + 1;
        var $00 = $K.getUTCFullYear();
        var m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ($Z !== 2) return m[$Z - 1];
        if ($00 % 4 !== 0) return m[1];
        if ($00 % 100 === 0 && $00 % 400 !== 0) return m[1];
        return m[1] + 1;
    };
    DayPilot.Date.prototype.daysInYear = function() {
        var $00 = this.getYear();
        if ($00 % 4 !== 0) {
            return 365;
        };
        if ($00 % 100 === 0 && $00 % 400 !== 0) {
            return 365;
        };
        return 366;
    };
    DayPilot.Date.prototype.dayOfYear = function() {
        return Math.ceil((this.getDatePart().getTime() - this.firstDayOfYear().getTime()) / 86400000) + 1;
    };
    DayPilot.Date.prototype.equals = function($01) {
        if ($01 === null) {
            return false;
        };
        if ($01 instanceof DayPilot.Date) {
            return this === $01;
        } else {
            throw "The parameter must be a DayPilot.Date object (DayPilot.Date.equals())";
        }
    };
    DayPilot.Date.prototype.firstDayOfMonth = function() {
        var d = new Date();
        d.setUTCFullYear(this.getYear(), this.getMonth(), 1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return new DayPilot.Date(d);
    };
    DayPilot.Date.prototype.firstDayOfYear = function() {
        var $00 = this.getYear();
        var d = new Date();
        d.setUTCFullYear($00, 0, 1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return new DayPilot.Date(d);
    };
    DayPilot.Date.prototype.firstDayOfWeek = function($02) {
        var d = this;
        var $02 = $02 || 0;
        var $03 = d.dayOfWeek();
        while ($03 !== $02) {
            d = d.addDays(-1);
            $03 = d.dayOfWeek();
        };
        return new DayPilot.Date(d);
    };
    DayPilot.Date.prototype.getDay = function() {
        return new Date(this.ticks).getUTCDate();
    };
    DayPilot.Date.prototype.getDatePart = function() {
        var d = new Date(this.ticks);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return new DayPilot.Date(d);
    };
    DayPilot.Date.prototype.getYear = function() {
        return new Date(this.ticks).getUTCFullYear();
    };
    DayPilot.Date.prototype.getHours = function() {
        return new Date(this.ticks).getUTCHours();
    };
    DayPilot.Date.prototype.getMilliseconds = function() {
        return new Date(this.ticks).getUTCMilliseconds();
    };
    DayPilot.Date.prototype.getMinutes = function() {
        return new Date(this.ticks).getUTCMinutes();
    };
    DayPilot.Date.prototype.getMonth = function() {
        return new Date(this.ticks).getUTCMonth();
    };
    DayPilot.Date.prototype.getSeconds = function() {
        return new Date(this.ticks).getUTCSeconds();
    };
    DayPilot.Date.prototype.getTotalTicks = function() {
        return this.getTime();
    };
    DayPilot.Date.prototype.getTime = function() {
        return this.ticks;
    };
    DayPilot.Date.prototype.getTimePart = function() {
        var $04 = this.getDatePart();
        return DayPilot.DateUtil.diff(this, $04);
    };
    DayPilot.Date.prototype.lastDayOfMonth = function() {
        var d = new Date(this.firstDayOfMonth().getTime());
        var length = this.daysInMonth();
        d.setUTCDate(length);
        return new DayPilot.Date(d);
    };
    DayPilot.Date.prototype.weekNumber = function() {
        var $05 = this.firstDayOfYear();
        var $Q = (this.getTime() - $05.getTime()) / 86400000;
        return Math.ceil(($Q + $05.dayOfWeek() + 1) / 7);
    };
    DayPilot.Date.prototype.weekNumberISO = function() {
        var $06 = false;
        var $07 = this.dayOfYear();
        var $08 = this.firstDayOfYear().dayOfWeek();
        var $09 = this.firstDayOfYear().addYears(1).addDays(-1).dayOfWeek();
        if ($08 === 0) {
            $08 = 7;
        };
        if ($09 === 0) {
            $09 = 7;
        };
        var $0a = 8 - ($08);
        if ($08 === 4 || $09 === 4) {
            $06 = true;
        };
        var $0b = Math.ceil(($07 - ($0a)) / 7.0);
        var $0c = $0b;
        if ($0a >= 4) {
            $0c = $0c + 1;
        };
        if ($0c > 52 && !$06) {
            $0c = 1;
        };
        if ($0c === 0) {
            $0c = this.firstDayOfYear().addDays(-1).weekNumberISO();
        };
        return $0c;
    };
    DayPilot.Date.prototype.toDateLocal = function() {
        var $K = new Date(this.ticks);
        var d = new Date();
        d.setFullYear($K.getUTCFullYear(), $K.getUTCMonth(), $K.getUTCDate());
        d.setHours($K.getUTCHours());
        d.setMinutes($K.getUTCMinutes());
        d.setSeconds($K.getUTCSeconds());
        d.setMilliseconds($K.getUTCMilliseconds());
        return d;
    };
    DayPilot.Date.prototype.toDate = function() {
        return new Date(this.ticks);
    };
    DayPilot.Date.prototype.toJSON = function() {
        return this.value;
    };
    DayPilot.Date.prototype.toString = function($0d, $J) {
        if (typeof $0d === 'undefined') {
            return this.toStringSortable();
        };
        return new $0e($0d, $J).print(this);
    };
    DayPilot.Date.prototype.toStringSortable = function() {
        return ticksToSortable(this.ticks);
    };

    function ticksToSortable($M) {
        var $N = DayPilot.Date.Cache.Ticks;
        if ($N[$M]) {
            DayPilot.Stats.cacheHitsTicks += 1;
            return $N[$M];
        };
        var d = new Date($M);
        var $0f;
        var ms = d.getUTCMilliseconds();
        if (ms === 0) {
            $0f = "";
        } else if (ms < 10) {
            $0f = ".00" + ms;
        } else if (ms < 100) {
            $0f = ".0" + ms;
        } else {
            $0f = "." + ms
        };
        var $0g = d.getUTCSeconds();
        if ($0g < 10) $0g = "0" + $0g;
        var $0h = d.getUTCMinutes();
        if ($0h < 10) $0h = "0" + $0h;
        var $0i = d.getUTCHours();
        if ($0i < 10) $0i = "0" + $0i;
        var $03 = d.getUTCDate();
        if ($03 < 10) $03 = "0" + $03;
        var $Z = d.getUTCMonth() + 1;
        if ($Z < 10) $Z = "0" + $Z;
        var $00 = d.getUTCFullYear();
        if ($00 <= 0) {
            throw "The minimum year supported is 1.";
        };
        if ($00 < 10) {
            $00 = "000" + $00;
        } else if ($00 < 100) {
            $00 = "00" + $00;
        } else if ($00 < 1000) {
            $00 = "0" + $00;
        };
        var $h = $00 + "-" + $Z + "-" + $03 + 'T' + $0i + ":" + $0h + ":" + $0g + $0f;
        $N[$M] = $h;
        return $h;
    };
    DayPilot.Date.parse = function(str, $0d, $J) {
        var p = new $0e($0d, $J);
        return p.parse(str);
    };
    DayPilot.Date.today = function() {
        return new DayPilot.Date().getDatePart();
    };
    DayPilot.Date.fromYearMonthDay = function($00, $Z, $03) {
        $Z = $Z || 1;
        $03 = $03 || 1;
        var d = new Date(0);
        d.setUTCFullYear($00);
        d.setUTCMonth($Z - 1);
        d.setUTCDate($03);
        return new DayPilot.Date(d);
    };
    DayPilot.DateUtil = {};
    DayPilot.DateUtil.fromStringSortable = function($0j, $L) {
        if (!$0j) {
            throw "Can't create DayPilot.Date from an empty string";
        };
        var $0k = $0j.length;
        var $K = $0k === 10;
        var $0l = $0k === 19;
        var long = $0k > 19;
        if (!$K && !$0l && !long) {
            throw "Invalid string format (use '2010-01-01' or '2010-01-01T00:00:00'): " + $0j;
        };
        if (DayPilot.Date.Cache.Parsing[$0j] && !$L) {
            DayPilot.Stats.cacheHitsParsing += 1;
            return DayPilot.Date.Cache.Parsing[$0j];
        };
        var $00 = $0j.substring(0, 4);
        var $Z = $0j.substring(5, 7);
        var $03 = $0j.substring(8, 10);
        var d = new Date(0);
        d.setUTCFullYear($00, $Z - 1, $03);
        if ($K) {
            DayPilot.Date.Cache.Parsing[$0j] = d;
            return d;
        };
        var $R = $0j.substring(11, 13);
        var $T = $0j.substring(14, 16);
        var $W = $0j.substring(17, 19);
        d.setUTCHours($R);
        d.setUTCMinutes($T);
        d.setUTCSeconds($W);
        if ($0l) {
            DayPilot.Date.Cache.Parsing[$0j] = d;
            return d;
        };
        var $0m = $0j[19];
        var $0n = 0;
        if ($0m === ".") {
            var ms = parseInt($0j.substring(20, 23));
            d.setUTCMilliseconds(ms);
            $0n = DayPilot.DateUtil.getTzOffsetMinutes($0j.substring(23));
        } else {
            $0n = DayPilot.DateUtil.getTzOffsetMinutes($0j.substring(19));
        };
        var dd = new DayPilot.Date(d);
        if (!$L) {
            dd = dd.addMinutes(-$0n);
        };
        d = dd.toDate();
        DayPilot.Date.Cache.Parsing[$0j] = d;
        return d;
    };
    DayPilot.DateUtil.getTzOffsetMinutes = function($0j) {
        if (DayPilot.Util.isNullOrUndefined($0j) || $0j === "") {
            return 0;
        };
        if ($0j === "Z") {
            return 0;
        };
        var $0m = $0j[0];
        var $0o = parseInt($0j.substring(1, 3));
        var $0p = parseInt($0j.substring(4));
        var $0n = $0o * 60 + $0p;
        if ($0m === "-") {
            return -$0n;
        } else if ($0m === "+") {
            return $0n;
        } else {
            throw "Invalid timezone spec: " + $0j;
        }
    };
    DayPilot.DateUtil.hasTzSpec = function($0j) {
        if ($0j.indexOf("+")) {
            return true;
        };
        if ($0j.indexOf("-")) {
            return true;
        };
        return false;
    };
    DayPilot.DateUtil.daysDiff = function($05, $0g) {
        ($05 && $0g) || (function() {
            throw "two parameters required";
        })();
        $05 = new DayPilot.Date($05);
        $0g = new DayPilot.Date($0g);
        if ($05.getTime() > $0g.getTime()) {
            return null;
        };
        var i = 0;
        var $0q = $05.getDatePart();
        var $0r = $0g.getDatePart();
        while ($0q < $0r) {
            $0q = $0q.addDays(1);
            i++;
        };
        return i;
    };
    DayPilot.DateUtil.daysSpan = function($05, $0g) {
        ($05 && $0g) || (function() {
            throw "two parameters required";
        })();
        $05 = new DayPilot.Date($05);
        $0g = new DayPilot.Date($0g);
        if ($05 === $0g) {
            return 0;
        };
        var $0s = DayPilot.DateUtil.daysDiff($05, $0g);
        if ($0g == $0g.getDatePart()) {
            $0s--;
        };
        return $0s;
    };
    DayPilot.DateUtil.diff = function($05, $0g) {
        if (!($05 && $0g && $05.getTime && $0g.getTime)) {
            throw "Both compared objects must be Date objects (DayPilot.Date.diff).";
        };
        return $05.getTime() - $0g.getTime();
    };
    DayPilot.DateUtil.fromLocal = function($0t) {
        if (!$0t) {
            $0t = new Date();
        };
        var d = new Date();
        d.setUTCFullYear($0t.getFullYear(), $0t.getMonth(), $0t.getDate());
        d.setUTCHours($0t.getHours());
        d.setUTCMinutes($0t.getMinutes());
        d.setUTCSeconds($0t.getSeconds());
        d.setUTCMilliseconds($0t.getMilliseconds());
        return d;
    };
    DayPilot.DateUtil.hours = function($K, $0u) {
        var $0h = $K.getUTCMinutes();
        if ($0h < 10) $0h = "0" + $0h;
        var $0i = $K.getUTCHours();
        if ($0u) {
            var am = $0i < 12;
            var $0i = $0i % 12;
            if ($0i === 0) {
                $0i = 12;
            };
            var $0v = am ? "AM" : "PM";
            return $0i + ':' + $0h + ' ' + $0v;
        } else {
            return $0i + ':' + $0h;
        }
    };
    DayPilot.DateUtil.max = function($05, $0g) {
        if ($05.getTime() > $0g.getTime()) {
            return $05;
        } else {
            return $0g;
        }
    };
    DayPilot.DateUtil.min = function($05, $0g) {
        if ($05.getTime() < $0g.getTime()) {
            return $05;
        } else {
            return $0g;
        }
    };
    var $0e = function($0d, $J) {
        if (typeof $J === "string") {
            $J = DayPilot.Locale.find($J);
        };
        var $J = $J || DayPilot.Locale.US;
        var $0w = [{
            "seq": "yyyy",
            "expr": "[0-9]{4,4\u007d",
            "str": function(d) {
                return d.getYear();
            }
        }, {
            "seq": "yy",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                return d.getYear() % 100;
            }
        }, {
            "seq": "mm",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getMinutes();
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "m",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getMinutes();
                return r;
            }
        }, {
            "seq": "HH",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getHours();
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "H",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getHours();
                return r;
            }
        }, {
            "seq": "hh",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var $0i = d.getHours();
                var $0i = $0i % 12;
                if ($0i === 0) {
                    $0i = 12;
                };
                var r = $0i;
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "h",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var $0i = d.getHours();
                var $0i = $0i % 12;
                if ($0i === 0) {
                    $0i = 12;
                };
                return $0i;
            }
        }, {
            "seq": "tt",
            "expr": "(AM|PM)",
            "str": function(d) {
                var $0i = d.getHours();
                var am = $0i < 12;
                return am ? "AM" : "PM";
            }
        }, {
            "seq": "ss",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getSeconds();
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "s",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getSeconds();
                return r;
            }
        }, {
            "seq": "MMMM",
            "expr": "[^\\s0-9]*",
            "str": function(d) {
                var r = $J.monthNames[d.getMonth()];
                return r;
            },
            "transform": function($0x) {
                var $p = DayPilot.indexOf($J.monthNames, $0x, $0y);
                if ($p < 0) {
                    return null;
                };
                return $p + 1;
            }
        }, {
            "seq": "MMM",
            "expr": "[^\\s0-9]*",
            "str": function(d) {
                var r = $J.monthNamesShort[d.getMonth()];
                return r;
            },
            "transform": function($0x) {
                var $p = DayPilot.indexOf($J.monthNamesShort, $0x, $0y);
                if ($p < 0) {
                    return null;
                };
                return $p + 1;
            }
        }, {
            "seq": "MM",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getMonth() + 1;
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "M",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getMonth() + 1;
                return r;
            }
        }, {
            "seq": "dddd",
            "expr": "[^\\s0-9]*",
            "str": function(d) {
                var r = $J.dayNames[d.getDayOfWeek()];
                return r;
            }
        }, {
            "seq": "ddd",
            "expr": "[^\\s0-9]*",
            "str": function(d) {
                var r = $J.dayNamesShort[d.getDayOfWeek()];
                return r;
            }
        }, {
            "seq": "dd",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getDay();
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "%d",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getDay();
                return r;
            }
        }, {
            "seq": "d",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getDay();
                return r;
            }
        }, ];
        var $0z = function($0A) {
            return $0A.replace(/[-[\]{};()*+?.,\\^$|#\s]/g, "\\$&");
        };
        this.init = function() {
            this.year = this.findSequence("yyyy");
            this.month = this.findSequence("MMMM") || this.findSequence("MMM") || this.findSequence("MM") || this.findSequence("M");
            this.day = this.findSequence("dd") || this.findSequence("d");
            this.hours = this.findSequence("HH") || this.findSequence("H");
            this.minutes = this.findSequence("mm") || this.findSequence("m");
            this.seconds = this.findSequence("ss") || this.findSequence("s");
        };
        this.findSequence = function($0B) {
            function defaultTransform($P) {
                return parseInt($P);
            };
            var $p = $0d.indexOf($0B);
            if ($p === -1) {
                return null;
            };
            return {
                "findValue": function($0x) {
                    var $0C = $0z($0d);
                    var $0D = null;
                    for (var i = 0; i < $0w.length; i++) {
                        var $0k = $0w[i].length;
                        var $0E = ($0B === $0w[i].seq);
                        var $0F = $0w[i].expr;
                        if ($0E) {
                            $0F = "(" + $0F + ")";
                            $0D = $0w[i].transform;
                        };
                        $0C = $0C.replace($0w[i].seq, $0F);
                    };
                    $0C = "^" + $0C + "$";
                    try {
                        var r = new RegExp($0C);
                        var $q = r.exec($0x);
                        if (!$q) {
                            return null;
                        };
                        $0D = $0D || defaultTransform;
                        return $0D($q[1]);
                    } catch (e) {
                        throw "unable to create regex from: " + $0C;
                    }
                }
            };
        };
        this.print = function($K) {
            var find = function(t) {
                for (var i = 0; i < $0w.length; i++) {
                    if ($0w[i] && $0w[i].seq === t) {
                        return $0w[i];
                    }
                };
                return null;
            };
            var $0G = $0d.length <= 0;
            var $0H = 0;
            var $0I = [];
            while (!$0G) {
                var $0J = $0d.substring($0H);
                var $0K = /%?(.)\1*/.exec($0J);
                if ($0K && $0K.length > 0) {
                    var $0L = $0K[0];
                    var q = find($0L);
                    if (q) {
                        $0I.push(q);
                    } else {
                        $0I.push($0L);
                    };
                    $0H += $0L.length;
                    $0G = $0d.length <= $0H;
                } else {
                    $0G = true;
                }
            };
            for (var i = 0; i < $0I.length; i++) {
                var c = $0I[i];
                if (typeof c !== 'string') {
                    $0I[i] = c.str($K);
                }
            };
            return $0I.join("");
        };
        this.parse = function($0x) {
            var $00 = this.year.findValue($0x);
            if (!$00) {
                return null;
            };
            var $Z = this.month.findValue($0x);
            if (DayPilot.Util.isNullOrUndefined($Z)) {
                return null;
            };
            if ($Z > 12 || $Z < 1) {
                return null;
            };
            var $03 = this.day.findValue($0x);
            var $0M = DayPilot.Date.fromYearMonthDay($00, $Z).daysInMonth();
            if ($03 < 1 || $03 > $0M) {
                return null;
            };
            var $R = this.hours ? this.hours.findValue($0x) : 0;
            var $T = this.minutes ? this.minutes.findValue($0x) : 0;
            var $W = this.seconds ? this.seconds.findValue($0x) : 0;
            var d = new Date();
            d.setUTCFullYear($00, $Z - 1, $03);
            d.setUTCHours($R);
            d.setUTCMinutes($T);
            d.setUTCSeconds($W);
            d.setUTCMilliseconds(0);
            return new DayPilot.Date(d);
        };
        this.init();
    };
    DayPilot.Event = function($0N, $0O, $0P) {
        var e = this;
        this.calendar = $0O;
        this.data = $0N ? $0N : {};
        this.part = $0P ? $0P : {};
        if (typeof this.data.id === 'undefined') {
            this.data.id = this.data.value;
        };
        var $0Q = {};
        var $0R = ["id", "text", "start", "end"];
        this.isEvent = true;
        this.temp = function() {
            if ($0Q.dirty) {
                return $0Q;
            };
            for (var i = 0; i < $0R.length; i++) {
                $0Q[$0R[i]] = e.data[$0R[i]];
            };
            $0Q.dirty = true;
            return $0Q;
        };
        this.copy = function() {
            var $h = {};
            for (var i = 0; i < $0R.length; i++) {
                $h[$0R[i]] = e.data[$0R[i]];
            };
            return $h;
        };
        this.commit = function() {
            if (!$0Q.dirty) {
                return;
            };
            for (var i = 0; i < $0R.length; i++) {
                e.data[$0R[i]] = $0Q[$0R[i]];
            };
            $0Q.dirty = false;
        };
        this.dirty = function() {
            return $0Q.dirty;
        };
        this.id = function($G) {
            if (typeof $G === 'undefined') {
                return e.data.id;
            } else {
                this.temp().id = $G;
            }
        };
        this.value = function($G) {
            if (typeof $G === 'undefined') {
                return e.id();
            } else {
                e.id($G);
            }
        };
        this.text = function($G) {
            if (typeof $G === 'undefined') {
                return e.data.text;
            } else {
                this.temp().text = $G;
                this.client.innerHTML($G);
            }
        };
        this.start = function($G) {
            if (typeof $G === 'undefined') {
                return new DayPilot.Date(e.data.start);
            } else {
                this.temp().start = new DayPilot.Date($G);
            }
        };
        this.end = function($G) {
            if (typeof $G === 'undefined') {
                return new DayPilot.Date(e.data.end);
            } else {
                this.temp().end = new DayPilot.Date($G);
            }
        };
        this.partStart = function() {
            return new DayPilot.Date(this.part.start);
        };
        this.partEnd = function() {
            return new DayPilot.Date(this.part.end);
        };
        this.tag = function($0S) {
            var $0T = e.data.tag;
            if (!$0T) {
                return null;
            };
            if (typeof $0S === 'undefined') {
                return e.data.tag;
            };
            var $0U = e.calendar.tagFields;
            var $p = -1;
            for (var i = 0; i < $0U.length; i++) {
                if ($0S === $0U[i]) $p = i;
            };
            if ($p === -1) {
                throw "Field name not found.";
            };
            return $0T[$p];
        };
        this.client = {};
        this.client.innerHTML = function($G) {
            if (typeof $G === 'undefined') {
                if (e.cache && typeof e.cache.html !== "undefined") {
                    return e.cache.html;
                };
                if (typeof e.data.html !== "undefined") {
                    return e.data.html;
                };
                return e.data.text;
            } else {
                e.data.html = $G;
            }
        };
        this.client.html = this.client.innerHTML;
        this.client.header = function($G) {
            if (typeof $G === 'undefined') {
                return e.data.header;
            } else {
                e.data.header = $G;
            }
        };
        this.client.cssClass = function($G) {
            if (typeof $G === 'undefined') {
                return e.data.cssClass;
            } else {
                e.data.cssClass = $G;
            }
        };
        this.client.toolTip = function($G) {
            if (typeof $G === 'undefined') {
                if (e.cache && typeof e.cache.toolTip !== "undefined") {
                    return e.cache.toolTip;
                };
                return typeof e.data.toolTip !== 'undefined' ? e.data.toolTip : e.data.text;
            } else {
                e.data.toolTip = $G;
            }
        };
        this.client.barVisible = function($G) {
            if (typeof $G === 'undefined') {
                if (e.cache && typeof e.cache.barHidden !== "undefined") {
                    return !e.cache.barHidden;
                };
                return e.calendar.durationBarVisible && !e.data.barHidden;
            } else {
                e.data.barHidden = !$G;
            }
        };
        this.client.backColor = function($G) {
            if (typeof $G === 'undefined') {
                if (e.cache && typeof e.cache.backColor !== "undefined") {
                    return e.cache.backColor;
                };
                return typeof e.data.backColor !== "undefined" ? e.data.backColor : e.calendar.eventBackColor;
            } else {
                e.data.backColor = $G;
            }
        };
        this.client.borderColor = function($G) {
            if (typeof $G === 'undefined') {
                if (e.cache && typeof e.cache.borderColor !== "undefined") {
                    return e.cache.borderColor;
                };
                return typeof e.data.borderColor !== "undefined" ? e.data.borderColor : e.calendar.eventBorderColor;
            } else {
                e.data.borderColor = $G;
            }
        };
        this.client.moveEnabled = function($G) {
            if (typeof $G === 'undefined') {
                return e.calendar.eventMoveHandling !== 'Disabled' && !e.data.moveDisabled;
            } else {
                e.data.moveDisabled = !$G;
            }
        };
        this.client.resizeEnabled = function($G) {
            if (typeof $G === 'undefined') {
                return e.calendar.eventResizeHandling !== 'Disabled' && !e.data.resizeDisabled;
            } else {
                e.data.resizeDisabled = !$G;
            }
        };
        this.client.clickEnabled = function($G) {
            if (typeof $G === 'undefined') {
                return e.calendar.eventClickHandling !== 'Disabled' && !e.data.clickDisabled;
            } else {
                e.data.clickDisabled = !$G;
            }
        };
        this.toJSON = function($x) {
            var $y = {};
            $y.value = this.id();
            $y.id = this.id();
            $y.text = this.text();
            $y.start = this.start();
            $y.end = this.end();
            $y.tag = {};
            if (e.calendar && e.calendar.tagFields) {
                var $0U = e.calendar.tagFields;
                for (var i = 0; i < $0U.length; i++) {
                    $y.tag[$0U[i]] = this.tag($0U[i]);
                }
            };
            return $y;
        };
    };
})();
DayPilot.JSON = {};
(function() {
    function f(n) {
        return n < 10 ? '0' + n : n;
    };
    if (typeof Date.prototype.toJSON2 !== 'function') {
        Date.prototype.toJSON2 = function($x) {
            return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + '';
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function($x) {
            return this.valueOf();
        };
    };
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        $0V = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        $0W, $0X, $0Y = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        $0Z;

    function quote($0j) {
        $0V.lastIndex = 0;
        return $0V.test($0j) ? '"' + $0j.replace($0V, function(a) {
            var c = $0Y[a];
            if (typeof c === 'string') {
                return c;
            };
            return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + $0j + '"';
    };

    function str($x, $10) {
        var i, k, v, length, $11 = $0W,
            $12, $P = $10[$x];
        if ($P && typeof $P === 'object' && typeof $P.toJSON2 === 'function') {
            $P = $P.toJSON2($x);
        } else if ($P && typeof $P === 'object' && typeof $P.toJSON === 'function' && !$P.ignoreToJSON) {
            $P = $P.toJSON($x);
        };
        if (typeof $0Z === 'function') {
            $P = $0Z.call($10, $x, $P);
        };
        switch (typeof $P) {
            case 'string':
                return quote($P);
            case 'number':
                return isFinite($P) ? String($P) : 'null';
            case 'boolean':
            case 'null':
                return String($P);
            case 'object':
                if (!$P) {
                    return 'null';
                };
                $0W += $0X;
                $12 = [];
                if (typeof $P.length === 'number' && !$P.propertyIsEnumerable('length')) {
                    length = $P.length;
                    for (i = 0; i < length; i += 1) {
                        $12[i] = str(i, $P) || 'null';
                    };
                    v = $12.length === 0 ? '[]' : $0W ? '[\n' + $0W + $12.join(',\n' + $0W) + '\n' + $11 + ']' : '[' + $12.join(',') + ']';
                    $0W = $11;
                    return v;
                };
                if ($0Z && typeof $0Z === 'object') {
                    length = $0Z.length;
                    for (i = 0; i < length; i += 1) {
                        k = $0Z[i];
                        if (typeof k === 'string') {
                            v = str(k, $P);
                            if (v) {
                                $12.push(quote(k) + ($0W ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in $P) {
                        if (Object.hasOwnProperty.call($P, k)) {
                            v = str(k, $P);
                            if (v) {
                                $12.push(quote(k) + ($0W ? ': ' : ':') + v);
                            }
                        }
                    }
                };
                v = ($12.length === 0) ? '{\u007D' : $0W ? '{\n' + $0W + $12.join(',\n' + $0W) + '\n' + $11 + '\u007D' : '{' + $12.join(',') + '\u007D';
                $0W = $11;
                return v;
        }
    };
    if (typeof DayPilot.JSON.stringify !== 'function') {
        DayPilot.JSON.stringify = function($P, $13, $14) {
            var i;
            $0W = '';
            $0X = '';
            if (typeof $14 === 'number') {
                for (i = 0; i < $14; i += 1) {
                    $0X += ' ';
                }
            } else if (typeof $14 === 'string') {
                $0X = $14;
            };
            $0Z = $13;
            if ($13 && typeof $13 !== 'function' && (typeof $13 !== 'object' || typeof $13.length !== 'number')) {
                throw new Error('JSON.stringify');
            };
            return str('', {
                '': $P
            });
        };
    }
})();


if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilot.Global === 'undefined') {
    DayPilot.Global = {};
};
(function() {
    var $a = function() {};
    if (typeof DayPilot.Calendar !== 'undefined') {
        return;
    };

    function loadDefaultCss() {
        if (DayPilot.Global.defaultCalendarCss) {
            return;
        };
        var $b = DayPilot.sheet();
        $b.add(".calendar_default_main", "border: 1px solid #999;font-family: Tahoma, Arial, sans-serif; font-size: 12px;");
        $b.add(".calendar_default_main *, .calendar_default_main *:before, .calendar_default_main *:after", "box-sizing: content-box;");
        $b.add(".calendar_default_rowheader_inner,.calendar_default_cornerright_inner,.calendar_default_corner_inner,.calendar_default_colheader_inner,.calendar_default_alldayheader_inner", "color: #666;background: #eee;");
        $b.add(".calendar_default_cornerright_inner", "position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;	border-bottom: 1px solid #999;");
        $b.add(".calendar_default_rowheader_inner", "font-size: 16pt;text-align: right; position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #999;border-bottom: 1px solid #999;");
        $b.add(".calendar_default_corner_inner", "position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #999;border-bottom: 1px solid #999;");
        $b.add(".calendar_default_rowheader_minutes", "font-size:10px;vertical-align: super;padding-left: 2px;padding-right: 2px;");
        $b.add(".calendar_default_colheader_inner", "text-align: center; position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #999;border-bottom: 1px solid #999;");
        $b.add(".calendar_default_cell_inner", "position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd; background: #f9f9f9;");
        $b.add(".calendar_default_cell_business .calendar_default_cell_inner", "background: #fff");
        $b.add(".calendar_default_alldayheader_inner", "text-align: center;position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #999;border-bottom: 1px solid #999;");
        $b.add(".calendar_default_message", "opacity: 0.9;filter: alpha(opacity=90);	padding: 10px; color: #ffffff;background: #ffa216;");
        $b.add(".calendar_default_alldayevent_inner,.calendar_default_event_inner", 'color: #666; border: 1px solid #999;');
        $b.add(".calendar_default_event_bar", "top: 0px;bottom: 0px;left: 0px;width: 4px;background-color: #9dc8e8;");
        $b.add(".calendar_default_event_bar_inner", "position: absolute;width: 4px;background-color: #1066a8;");
        $b.add(".calendar_default_alldayevent_inner,.calendar_default_event_inner", 'background: #fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        $b.add(".calendar_default_selected .calendar_default_event_inner", "background: #ddd;");
        $b.add(".calendar_default_alldayevent_inner", "position: absolute;top: 2px;bottom: 2px;left: 2px;right: 2px;padding: 2px;margin-right: 1px;font-size: 12px;");
        $b.add(".calendar_default_event_withheader .calendar_default_event_inner", "padding-top: 15px;");
        $b.add(".calendar_default_event", "cursor: default;");
        $b.add(".calendar_default_event_inner", "position: absolute;overflow: hidden;top: 0px;bottom: 0px;left: 0px;right: 0px;padding: 2px 2px 2px 6px;font-size: 12px;");
        $b.add(".calendar_default_shadow_inner", "background-color: #666666;	opacity: 0.5;filter: alpha(opacity=50);height: 100%;");
        $b.commit();
        DayPilot.Global.defaultCalendarCss = true;
    };
    var DayPilotCalendar = {};
    DayPilotCalendar.selectedCells = [];
    DayPilotCalendar.topSelectedCell = null;
    DayPilotCalendar.bottomSelectedCell = null;
    DayPilotCalendar.selecting = false;
    DayPilotCalendar.column = null;
    DayPilotCalendar.firstSelected = null;
    DayPilotCalendar.firstMousePos = null;
    DayPilotCalendar.originalMouse = null;
    DayPilotCalendar.originalHeight = null;
    DayPilotCalendar.originalTop = null;
    DayPilotCalendar.resizing = null;
    DayPilotCalendar.globalHandlers = false;
    DayPilotCalendar.moving = null;
    DayPilotCalendar.register = function($c) {
        if (!DayPilotCalendar.registered) {
            DayPilotCalendar.registered = [];
        };
        var r = DayPilotCalendar.registered;
        for (var i = 0; i < r.length; i++) {
            if (r[i] === $c) {
                return;
            }
        };
        r.push($c);
    };
    DayPilotCalendar.unregister = function($c) {
        var a = DayPilotCalendar.registered;
        if (!a) {
            return;
        };
        var i = DayPilot.indexOf(a, $c);
        if (i === -1) {
            return;
        };
        a.splice(i, 1);
    };
    DayPilotCalendar.getCellsAbove = function($d) {
        var $e = [];
        var c = DayPilotCalendar.getColumn($d);
        var tr = $d.parentNode;
        var $f = null;
        while (tr && $f !== DayPilotCalendar.firstSelected) {
            $f = tr.getElementsByTagName("td")[c];
            $e.push($f);
            tr = tr.previousSibling;
            while (tr && tr.tagName !== "TR") {
                tr = tr.previousSibling;
            }
        };
        return $e;
    };
    DayPilotCalendar.getCellsBelow = function($d) {
        var $e = [];
        var c = DayPilotCalendar.getColumn($d);
        var tr = $d.parentNode;
        var $f = null;
        while (tr && $f !== DayPilotCalendar.firstSelected) {
            $f = tr.getElementsByTagName("td")[c];
            $e.push($f);
            tr = tr.nextSibling;
            while (tr && tr.tagName !== "TR") {
                tr = tr.nextSibling;
            }
        };
        return $e;
    };
    DayPilotCalendar.getColumn = function($d) {
        var i = 0;
        while ($d.previousSibling) {
            $d = $d.previousSibling;
            if ($d.tagName === "TD") {
                i++;
            }
        };
        return i;
    };
    DayPilotCalendar.gUnload = function(ev) {
        if (!DayPilotCalendar.registered) {
            return;
        };
        var r = DayPilotCalendar.registered;
        for (var i = 0; i < r.length; i++) {
            var c = r[i];
            c.dispose();
            DayPilotCalendar.unregister(c);
        }
    };
    DayPilotCalendar.gMouseUp = function(e) {
        if (DayPilotCalendar.resizing) {
            if (!DayPilotCalendar.resizingShadow) {
                DayPilotCalendar.resizing.style.cursor = 'default';
                document.body.style.cursor = 'default';
                DayPilotCalendar.resizing = null;
                return;
            };
            var $g = DayPilotCalendar.resizing.event;
            var $h = DayPilotCalendar.resizingShadow.clientHeight + 4;
            var top = DayPilotCalendar.resizingShadow.offsetTop;
            var $i = DayPilotCalendar.resizing.dpBorder;
            DayPilotCalendar.deleteShadow(DayPilotCalendar.resizingShadow);
            DayPilotCalendar.resizingShadow = null;
            DayPilotCalendar.resizing.style.cursor = 'default';
            $g.calendar.nav.top.style.cursor = 'auto';
            DayPilotCalendar.resizing.onclick = null;
            DayPilotCalendar.resizing = null;
            $g.calendar.eventResizeDispatch($g, $h, top, $i);
        } else if (DayPilotCalendar.moving) {
            if (!DayPilotCalendar.movingShadow) {
                DayPilotCalendar.moving = null;
                document.body.style.cursor = 'default';
                return;
            };
            var top = DayPilotCalendar.movingShadow.offsetTop;
            DayPilotCalendar.deleteShadow(DayPilotCalendar.movingShadow);
            var $g = DayPilotCalendar.moving.event;
            var $j = DayPilotCalendar.movingShadow.column;
            DayPilotCalendar.moving = null;
            DayPilotCalendar.movingShadow = null;
            $g.calendar.nav.top.style.cursor = 'auto';
            var ev = e || window.event;
            $g.calendar.eventMoveDispatch($g, $j, top, ev);
        } else if (DayPilotCalendar.selecting && DayPilotCalendar.topSelectedCell !== null) {
            var $c = DayPilotCalendar.selecting.calendar;
            DayPilotCalendar.selecting = false;
            var $k = $c.getSelection();
            $c.timeRangeSelectedDispatch($k.start, $k.end);
            if ($c.timeRangeSelectedHandling !== "Hold" && $c.timeRangeSelectedHandling !== "HoldForever") {
                $a();
            }
        } else {
            DayPilotCalendar.selecting = false;
        }
    };
    DayPilotCalendar.deleteShadow = function($l) {
        if (!$l) {
            return;
        };
        if (!$l.parentNode) {
            return;
        };
        $l.parentNode.removeChild($l);
    };
    DayPilotCalendar.moveShadow = function($m) {
        var $l = DayPilotCalendar.movingShadow;
        var parent = $l.parentNode;
        parent.style.display = 'none';
        $l.parentNode.removeChild($l);
        $m.firstChild.appendChild($l);
        $l.style.left = '0px';
        parent.style.display = '';
        $l.style.width = (DayPilotCalendar.movingShadow.parentNode.offsetWidth + 1) + 'px';
    };
    DayPilotCalendar.Calendar = function(id) {
        var $n = false;
        if (this instanceof DayPilotCalendar.Calendar && !this.$1E) {
            $n = true;
            this.$1E = true;
        };
        if (!$n) {
            throw "DayPilot.Calendar() is a constructor and must be called as 'var c = new DayPilot.Calendar(id);'";
        };
        var $c = this;
        this.uniqueID = null;
        this.v = '192-lite';
        this.id = id;
        this.clientName = id;
        this.cache = {};
        this.cache.pixels = {};
        this.elements = {};
        this.elements.events = [];
        this.nav = {};
        this.afterRender = function() {};
        this.fasterDispose = true;
        this.angularAutoApply = true;
        this.api = 2;
        this.borderColor = "#CED2CE";
        this.businessBeginsHour = 9;
        this.businessEndsHour = 18;
        this.cellBackColor = "#ffffff";
        this.cellBorderColor = "#DEDFDE";
        this.cellHeight = 20;
        this.columnMarginRight = 5;
        this.cornerBackColor = "#F3F3F9";
        this.cssOnly = true;
        this.days = 1;
        this.durationBarVisible = true;
        this.eventBackColor = '#638EDE';
        this.eventBorderColor = "#2951A5";
        this.eventFontFamily = 'Tahoma, Arial, Helvetica, sans-serif';
        this.eventFontSize = '8pt';
        this.eventFontColor = "#ffffff";
        this.eventHeaderFontSize = '8pt';
        this.eventHeaderFontColor = "#ffffff";
        this.eventHeaderHeight = 14;
        this.eventHeaderVisible = true;
        this.headerFontSize = '10pt';
        this.headerFontFamily = 'Tahoma, Arial, Helvetica, sans-serif';
        this.headerFontColor = "#42658C";
        this.headerHeight = 20;
        this.height = 300;
        this.heightSpec = 'BusinessHours';
        this.hideUntilInit = true;
        this.hourHalfBorderColor = "#EBEDEB";
        this.hourBorderColor = "#DEDFDE";
        this.hourFontColor = "#42658C";
        this.hourFontFamily = "Tahoma, Arial, Helvetica, sans-serif";
        this.hourFontSize = "16pt";
        this.hourNameBackColor = "#F3F3F9";
        this.hourNameBorderColor = "#DEDFDE";
        this.hourWidth = 45;
        this.initScrollPos = 'Auto';
        this.loadingLabelText = "Loading...";
        this.loadingLabelVisible = true;
        this.loadingLabelBackColor = "ff0000";
        this.loadingLabelFontColor = "#ffffff";
        this.loadingLabelFontFamily = "Tahoma, Arial, Helvetica, sans-serif";
        this.loadingLabelFontSize = "10pt";
        this.locale = "en-us";
        this.selectedColor = "#316AC5";
        this.showToolTip = true;
        this.startDate = new DayPilot.Date().getDatePart();
        this.cssClassPrefix = "calendar_default";
        this.theme = null;
        this.timeFormat = 'Auto';
        this.visible = true;
        this.timeRangeSelectedHandling = 'Enabled';
        this.eventClickHandling = 'Enabled';
        this.eventResizeHandling = 'Update';
        this.eventMoveHandling = 'Update';
        this.onEventClick = null;
        this.onEventClicked = null;
        this.onEventMove = null;
        this.onEventMoved = null;
        this.onEventResize = null;
        this.onEventResized = null;
        this.onTimeRangeSelect = null;
        this.onTimeRangeSelected = null;
        this.clearSelection = function() {
            for (var j = 0; j < DayPilotCalendar.selectedCells.length; j++) {
                var $d = DayPilotCalendar.selectedCells[j];
                if ($d) {
                    if ($d.selected) {
                        DayPilot.de($d.selected);
                        $d.firstChild && ($d.firstChild.style.display = '');
                        $d.selected = null;
                    }
                }
            };
            DayPilotCalendar.selectedCells = [];
        };
        this.ie = (navigator && navigator.userAgent && navigator.userAgent.indexOf("MSIE") !== -1);
        this.ff = (navigator && navigator.userAgent && navigator.userAgent.indexOf("Firefox") !== -1);
        this.opera105 = (function() {
            if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                var v = new Number(RegExp.$1);
                return v >= 10.5;
            };
            return false;
        })();
        this.webkit522 = (function() {
            if (/AppleWebKit[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                var v = new Number(RegExp.$1);
                return v >= 522;
            };
            return false;
        })();
        this.cleanSelection = this.clearSelection;
        this.$1F = function($o, $p, $q) {
            var $r = {};
            $r.action = $o;
            $r.parameters = $q;
            $r.data = $p;
            $r.header = this.$1G();
            var $s = "JSON" + DayPilot.JSON.stringify($r);
            __doPostBack($c.uniqueID, $s);
        };
        this.$1H = function($o, $p, $q) {
            if (this.callbackTimeout) {
                window.clearTimeout(this.callbackTimeout);
            };
            this.callbackTimeout = window.setTimeout(function() {
                $c.loadingStart();
            }, 100);
            var $r = {};
            $r.action = $o;
            $r.parameters = $q;
            $r.data = $p;
            $r.header = this.$1G();
            var $s = "JSON" + DayPilot.JSON.stringify($r);
            if (this.backendUrl) {
                DayPilot.request(this.backendUrl, this.callBackResponse, $s, this.ajaxError);
            } else if (typeof WebForm_DoCallback === 'function') {
                WebForm_DoCallback(this.uniqueID, $s, this.updateView, this.clientName, this.onCallbackError, true);
            }
        };
        this.onCallbackError = function($t, $u) {
            alert("Error!\r\nResult: " + $t + "\r\nContext:" + $u);
        };
        this.dispose = function() {
            var c = $c;
            c.deleteEvents();
            c.nav.zoom.onmousemove = null;
            c.nav.scroll.root = null;
            DayPilot.pu(c.nav.loading);
            c.disposeMain();
            c.disposeHeader();
            c.nav.select = null;
            c.nav.cornerRight = null;
            c.nav.scrollable = null;
            c.nav.zoom = null;
            c.nav.loading = null;
            c.nav.header = null;
            c.nav.hourTable = null;
            c.nav.scrolltop = null;
            c.nav.scroll = null;
            c.nav.main = null;
            c.nav.message = null;
            c.nav.messageClose = null;
            c.nav.top = null;
            DayPilotCalendar.unregister(c);
        };
        this.registerDispose = function() {
            this.nav.top.dispose = this.dispose;
        };
        this.callBackResponse = function($v) {
            $c.updateView($v.responseText);
        };
        this.$1G = function() {
            var h = {};
            h.control = "dpc";
            h.id = this.id;
            h.v = this.v;
            h.days = $c.days;
            h.startDate = $c.startDate;
            h.heightSpec = $c.heightSpec;
            h.businessBeginsHour = $c.businessBeginsHour;
            h.businessEndsHour = $c.businessEndsHour;
            h.hashes = $c.hashes;
            h.backColor = $c.cellBackColor;
            h.timeFormat = $c.timeFormat;
            h.viewType = $c.viewType;
            h.locale = $c.locale;
            return h;
        };
        this.createShadow = function($w, $x) {
            var $y = $w.parentNode;
            while ($y && $y.tagName !== "TD") {
                $y = $y.parentNode;
            };
            var $l = document.createElement('div');
            $l.setAttribute('unselectable', 'on');
            $l.style.position = 'absolute';
            $l.style.width = ($w.offsetWidth - 4) + 'px';
            $l.style.height = ($w.offsetHeight - 4) + 'px';
            $l.style.left = ($w.offsetLeft) + 'px';
            $l.style.top = ($w.offsetTop) + 'px';
            $l.style.border = '2px dotted #666666';
            $l.style.zIndex = 101;
            $l.style.backgroundColor = "#aaaaaa";
            $l.style.opacity = 0.5;
            $l.style.filter = "alpha(opacity=50)";
            $l.style.border = '2px solid #aaaaaa';
            if ($x && false) {
                $l.style.overflow = 'hidden';
                $l.style.fontSize = $w.style.fontSize;
                $l.style.fontFamily = $w.style.fontFamily;
                $l.style.color = $w.style.color;
                $l.innerHTML = $w.data.client.html();
            };
            $y.firstChild.appendChild($l);
            return $l;
        };
        this.$1I = {};
        this.$1I.locale = function() {
            var $z = DayPilot.Locale.find($c.locale);
            if (!$z) {
                return DayPilot.Locale.US;
            };
            return $z;
        };
        this.$1I.timeFormat = function() {
            if ($c.timeFormat !== 'Auto') {
                return $c.timeFormat;
            };
            return this.locale().timeFormat;
        };
        var $A = this.$1I;
        this.updateView = function($t, $u) {
            if ($t && $t.indexOf("$$$") === 0) {
                if (window.console) {
                    console.log("Error received from the server side: " + $t);
                } else {
                    throw "Error received from the server side: " + $t;
                };
                return;
            };
            var $t = eval("(" + $t + ")");
            if ($t.CallBackRedirect) {
                document.location.href = $t.CallBackRedirect;
                return;
            };
            if ($t.UpdateType === "None") {
                $c.loadingStop();
                $c.$1J();
                return;
            };
            $c.deleteEvents();
            if ($t.UpdateType === "Full") {
                $c.columns = $t.Columns;
                $c.days = $t.Days;
                $c.startDate = new DayPilot.Date($t.StartDate);
                $c.heightSpec = $t.HeightSpec ? $t.HeightSpec : $c.heightSpec;
                $c.businessBeginsHour = $t.BusinessBeginsHour ? $t.BusinessBeginsHour : $c.businessBeginsHour;
                $c.businessEndsHour = $t.BusinessEndsHour ? $t.BusinessEndsHour : $c.businessEndsHour;
                $c.headerDateFormat = $t.HeaderDateFormat ? $t.HeaderDateFormat : $c.headerDateFormat;
                $c.viewType = $t.ViewType;
                $c.backColor = $t.BackColor ? $t.BackColor : $c.backColor;
                $c.eventHeaderVisible = $t.EventHeaderVisible ? $t.EventHeaderVisible : $c.eventHeaderVisible;
                $c.timeFormat = $t.TimeFormat ? $t.TimeFormat : $c.timeFormat;
                $c.locale = $t.Locale ? $t.Locale : $c.locale;
                $c.prepareColumns();
            };
            $c.events.list = $t.Events;
            $c.loadEvents();
            $c.updateHeaderHeight();
            if ($t.UpdateType === "Full") {
                $c.drawHeader();
                $c.drawMain();
                $c.drawHourTable();
                $c.updateHeight();
            };
            $c.$1J();
            $c.drawEvents();
            $c.clearSelection();
            $c.afterRender($t.CallBackData, true);
            $c.loadingStop();
        };
        this.durationHours = function() {
            return 24;
        };
        this.businessHoursSpan = function() {
            if (this.businessBeginsHour > this.businessEndsHour) {
                return 24 - this.businessBeginsHour + this.businessEndsHour;
            } else {
                return this.businessEndsHour - this.businessBeginsHour;
            }
        };
        this.rowCount = function() {
            return 48;
        };
        this.$1K = function() {
            return $c.api === 2;
        };
        this.eventClickCallBack = function(e, $p) {
            this.$1H('EventClick', $p, e);
        };
        this.eventClickPostBack = function(e, $p) {
            this.$1F('EventClick', $p, e);
        };
        this.eventClickDispatch = function(e) {
            var $B = this;
            var e = $B.event;
            if ($c.$1K()) {
                var $C = {};
                $C.e = e;
                $C.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onEventClick === 'function') {
                    $c.$1L.apply(function() {
                        $c.onEventClick($C);
                    });
                    if ($C.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.eventClickHandling) {
                    case 'CallBack':
                        $c.eventClickCallBack(e);
                        break;
                    case 'PostBack':
                        $c.eventClickPostBack(e);
                        break;
                };
                if (typeof $c.onEventClicked === 'function') {
                    $c.$1L.apply(function() {
                        $c.onEventClicked($C);
                    });
                }
            } else {
                switch ($c.eventClickHandling) {
                    case 'PostBack':
                        $c.eventClickPostBack(e);
                        break;
                    case 'CallBack':
                        $c.eventClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $c.onEventClick(e);
                        break;
                }
            }
        };
        this.eventResizeCallBack = function(e, $D, $E, $p) {
            if (!$D) throw 'newStart is null';
            if (!$E) throw 'newEnd is null';
            var $F = {};
            $F.e = e;
            $F.newStart = $D;
            $F.newEnd = $E;
            this.$1H('EventResize', $p, $F);
        };
        this.eventResizePostBack = function(e, $D, $E, $p) {
            if (!$D) throw 'newStart is null';
            if (!$E) throw 'newEnd is null';
            var $F = {};
            $F.e = e;
            $F.newStart = $D;
            $F.newEnd = $E;
            this.$1F('EventResize', $p, $F);
        };
        this.eventResizeDispatch = function(e, $G, $H, $i) {
            var $I = 1;
            var $D = new Date();
            var $E = new Date();
            var $J = e.start();
            var end = e.end();
            if ($i === 'top') {
                var $K = $J.getDatePart();
                var $L = Math.floor(($H - $I) / $c.cellHeight);
                var $M = $L * 30;
                var ts = $M * 60 * 1000;
                $D = $K.addTime(ts);
                $E = e.end();
            } else if ($i === 'bottom') {
                var $K = end.getDatePart();
                var $L = Math.floor(($H + $G - $I) / $c.cellHeight);
                var $M = $L * 30;
                var ts = $M * 60 * 1000;
                $D = $J;
                $E = $K.addTime(ts);
            };
            if ($c.$1K()) {
                var $C = {};
                $C.e = e;
                $C.newStart = $D;
                $C.newEnd = $E;
                $C.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onEventResize === 'function') {
                    $c.$1L.apply(function() {
                        $c.onEventResize($C);
                    });
                    if ($C.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.eventResizeHandling) {
                    case 'PostBack':
                        $c.eventResizePostBack(e, $D, $E);
                        break;
                    case 'CallBack':
                        $c.eventResizeCallBack(e, $D, $E);
                        break;
                    case 'Update':
                        e.start($D);
                        e.end($E);
                        $c.events.update(e);
                        break;
                };
                if (typeof $c.onEventResized === 'function') {
                    $c.$1L.apply(function() {
                        $c.onEventResized($C);
                    });
                }
            } else {
                switch ($c.eventResizeHandling) {
                    case 'PostBack':
                        $c.eventResizePostBack(e, $D, $E);
                        break;
                    case 'CallBack':
                        $c.eventResizeCallBack(e, $D, $E);
                        break;
                    case 'JavaScript':
                        $c.onEventResize(e, $D, $E);
                        break;
                }
            }
        };
        this.eventMovePostBack = function(e, $D, $E, $N, $p) {
            if (!$D) throw 'newStart is null';
            if (!$E) throw 'newEnd is null';
            var $F = {};
            $F.e = e;
            $F.newStart = $D;
            $F.newEnd = $E;
            this.$1F('EventMove', $p, $F);
        };
        this.eventMoveCallBack = function(e, $D, $E, $N, $p) {
            if (!$D) throw 'newStart is null';
            if (!$E) throw 'newEnd is null';
            var $F = {};
            $F.e = e;
            $F.newStart = $D;
            $F.newEnd = $E;
            this.$1H('EventMove', $p, $F);
        };
        this.eventMoveDispatch = function(e, $j, $H, ev) {
            var $I = 1;
            var $L = Math.floor(($H - $I) / $c.cellHeight);
            var $O = $L * 30 * 60 * 1000;
            var $J = e.start();
            var end = e.end();
            var $K = new Date();
            if ($J instanceof DayPilot.Date) {
                $J = $J.toDate();
            };
            $K.setTime(Date.UTC($J.getUTCFullYear(), $J.getUTCMonth(), $J.getUTCDate()));
            var $P = $J.getTime() - ($K.getTime() + $J.getUTCHours() * 3600 * 1000 + Math.floor($J.getUTCMinutes() / 30) * 30 * 60 * 1000);
            var length = end.getTime() - $J.getTime();
            var $Q = this.columns[$j];
            var $R = $Q.Start.getTime();
            var $S = new Date();
            $S.setTime($R + $O + $P);
            var $D = new DayPilot.Date($S);
            var $E = $D.addTime(length);
            if ($c.$1K()) {
                var $C = {};
                $C.e = e;
                $C.newStart = $D;
                $C.newEnd = $E;
                $C.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onEventMove === 'function') {
                    $c.$1L.apply(function() {
                        $c.onEventMove($C);
                    });
                    if ($C.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.eventMoveHandling) {
                    case 'PostBack':
                        $c.eventMovePostBack(e, $D, $E, $Q.Value);
                        break;
                    case 'CallBack':
                        $c.eventMoveCallBack(e, $D, $E, $Q.Value);
                        break;
                    case 'Update':
                        e.start($D);
                        e.end($E);
                        $c.events.update(e);
                        break;
                };
                if (typeof $c.onEventMoved === 'function') {
                    $c.$1L.apply(function() {
                        $c.onEventMoved($C);
                    });
                }
            } else {
                switch ($c.eventMoveHandling) {
                    case 'PostBack':
                        $c.eventMovePostBack(e, $D, $E, $Q.Value);
                        break;
                    case 'CallBack':
                        $c.eventMoveCallBack(e, $D, $E, $Q.Value);
                        break;
                    case 'JavaScript':
                        $c.onEventMove(e, $D, $E, $Q.Value, false);
                        break;
                }
            }
        };
        this.timeRangeSelectedPostBack = function($J, end, $T, $p) {
            var $U = {};
            $U.start = $J;
            $U.end = end;
            this.$1F('TimeRangeSelected', $p, $U);
        };
        this.timeRangeSelectedCallBack = function($J, end, $T, $p) {
            var $U = {};
            $U.start = $J;
            $U.end = end;
            this.$1H('TimeRangeSelected', $p, $U);
        };
        this.timeRangeSelectedDispatch = function($J, end) {
            $J = new DayPilot.Date($J);
            end = new DayPilot.Date(end);
            if (this.$1K()) {
                var $C = {};
                $C.start = $J;
                $C.end = end;
                $C.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onTimeRangeSelect === 'function') {
                    $c.$1L.apply(function() {
                        $c.onTimeRangeSelect($C);
                    });
                    if ($C.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.timeRangeSelectedHandling) {
                    case 'PostBack':
                        $c.timeRangeSelectedPostBack($J, end);
                        break;
                    case 'CallBack':
                        $c.timeRangeSelectedCallBack($J, end);
                        break;
                };
                if (typeof $c.onTimeRangeSelected === 'function') {
                    $c.$1L.apply(function() {
                        $c.onTimeRangeSelected($C);
                    });
                }
            } else {
                switch ($c.timeRangeSelectedHandling) {
                    case 'PostBack':
                        $c.timeRangeSelectedPostBack($J, end);
                        break;
                    case 'CallBack':
                        $c.timeRangeSelectedCallBack($J, end);
                        break;
                    case 'JavaScript':
                        $c.onTimeRangeSelected($J, end);
                        break;
                }
            }
        };
        this.onCellMousedown = function(ev) {
            if (DayPilotCalendar.selecting) {
                return;
            };
            if ($c.timeRangeSelectedHandling === "Disabled") {
                return;
            };
            var $V = (window.event) ? window.event.button : ev.which;
            if ($V !== 1 && $V !== 0) {
                return;
            };
            DayPilotCalendar.firstMousePos = DayPilot.mc(ev || window.event);
            DayPilotCalendar.selecting = {};
            DayPilotCalendar.selecting.calendar = $c;
            if (DayPilotCalendar.selectedCells) {
                $c.clearSelection();
                DayPilotCalendar.selectedCells = [];
            };
            DayPilotCalendar.column = DayPilotCalendar.getColumn(this);
            DayPilotCalendar.selectedCells.push(this);
            DayPilotCalendar.firstSelected = this;
            DayPilotCalendar.topSelectedCell = this;
            DayPilotCalendar.bottomSelectedCell = this;
            $c.activateSelection();
            return false;
        };
        this.activateSelection = function() {
            var $W = this.getSelection();
            for (var j = 0; j < DayPilotCalendar.selectedCells.length; j++) {
                var $d = DayPilotCalendar.selectedCells[j];
                if ($d && !$d.selected) {
                    var $X = document.createElement("div");
                    $X.style.height = ($c.cellHeight - 1) + "px";
                    $X.style.backgroundColor = $c.selectedColor;
                    $d.firstChild.style.display = "none";
                    $d.insertBefore($X, $d.firstChild);
                    $d.selected = $X;
                }
            }
        };
        this.mousemove = function(ev) {
            if (typeof(DayPilotCalendar) === 'undefined') {
                return;
            };
            if (!DayPilotCalendar.selecting) {
                return;
            };
            var $Y = DayPilot.mc(ev || window.event);
            var $Z = DayPilotCalendar.getColumn(this);
            if ($Z !== DayPilotCalendar.column) {
                return;
            };
            $c.clearSelection();
            if ($Y.y < DayPilotCalendar.firstMousePos.y) {
                DayPilotCalendar.selectedCells = DayPilotCalendar.getCellsBelow(this);
                DayPilotCalendar.topSelectedCell = DayPilotCalendar.selectedCells[0];
                DayPilotCalendar.bottomSelectedCell = DayPilotCalendar.firstSelected;
            } else {
                DayPilotCalendar.selectedCells = DayPilotCalendar.getCellsAbove(this);
                DayPilotCalendar.topSelectedCell = DayPilotCalendar.firstSelected;
                DayPilotCalendar.bottomSelectedCell = DayPilotCalendar.selectedCells[0];
            };
            $c.activateSelection();
        };
        this.getSelection = function() {
            var $J = DayPilotCalendar.topSelectedCell.start;
            var end = DayPilotCalendar.bottomSelectedCell.end;
            return new DayPilot.Selection($J, end, null, $c);
        };
        this.mouseup = function(ev) {};
        this.prepareColumns = function() {
            this.columns = this.$1M();
            for (var i = 0; i < this.columns.length; i++) {
                this.activateColumn(this.columns[i]);
            }
        };
        this.activateColumn = function($m) {
            $m.Start = new DayPilot.Date($m.Start);
            $m.putIntoBlock = function(ep) {
                for (var i = 0; i < this.blocks.length; i++) {
                    var $00 = this.blocks[i];
                    if ($00.overlapsWith(ep.part.top, ep.part.height)) {
                        $00.events.push(ep);
                        $00.min = Math.min($00.min, ep.part.top);
                        $00.max = Math.max($00.max, ep.part.top + ep.part.height);
                        return i;
                    }
                };
                var $00 = [];
                $00.lines = [];
                $00.events = [];
                $00.overlapsWith = function($J, $01) {
                    var end = $J + $01 - 1;
                    if (!(end < this.min || $J > this.max - 1)) {
                        return true;
                    };
                    return false;
                };
                $00.putIntoLine = function(ep) {
                    var $02 = this;
                    for (var i = 0; i < this.lines.length; i++) {
                        var $03 = this.lines[i];
                        if ($03.isFree(ep.part.top, ep.part.height)) {
                            $03.push(ep);
                            return i;
                        }
                    };
                    var $03 = [];
                    $03.isFree = function($J, $01) {
                        var end = $J + $01 - 1;
                        var $04 = this.length;
                        for (var i = 0; i < $04; i++) {
                            var e = this[i];
                            if (!(end < e.part.top || $J > e.part.top + e.part.height - 1)) {
                                return false;
                            }
                        };
                        return true;
                    };
                    $03.push(ep);
                    this.lines.push($03);
                    return this.lines.length - 1;
                };
                $00.events.push(ep);
                $00.min = ep.part.top;
                $00.max = ep.part.top + ep.part.height;
                this.blocks.push($00);
                return this.blocks.length - 1;
            };
            $m.putIntoLine = function(ep) {
                var $02 = this;
                for (var i = 0; i < this.lines.length; i++) {
                    var $03 = this.lines[i];
                    if ($03.isFree(ep.part.top, ep.part.height)) {
                        $03.push(ep);
                        return i;
                    }
                };
                var $03 = [];
                $03.isFree = function($J, $01) {
                    var end = $J + $01 - 1;
                    var $04 = this.length;
                    for (var i = 0; i < $04; i++) {
                        var e = this[i];
                        if (!(end < e.part.top || $J > e.part.top + e.part.height - 1)) {
                            return false;
                        }
                    };
                    return true;
                };
                $03.push(ep);
                this.lines.push($03);
                return this.lines.length - 1;
            };
        };
        this.$1M = function() {
            var $05 = [];
            var $J = this.startDate.getDatePart();
            var $06 = this.days;
            switch (this.viewType) {
                case "Day":
                    $06 = 1;
                    break;
                case "Week":
                    $06 = 7;
                    $J = $J.firstDayOfWeek($A.locale().weekStarts);
                    break;
                case "WorkWeek":
                    $06 = 5;
                    $J = $J.firstDayOfWeek(1);
                    break;
            };
            for (var i = 0; i < $06; i++) {
                var $07 = $c.headerDateFormat ? $c.headerDateFormat : $A.locale().datePattern;
                var $m = {};
                $m.Start = $J.addDays(i);
                $m.Name = $m.Start.toString($07, $A.locale());
                $m.InnerHTML = $m.Name;
                $05.push($m);
            };
            return $05;
        };
        this.visibleStart = function() {
            return this.columns[0].Start;
        };
        this.visibleEnd = function() {
            var $04 = this.columns.length - 1;
            return this.columns[$04].Start.addDays(1);
        };
        this.$1N = function($08) {
            var $09 = this.theme || this.cssClassPrefix;
            if ($09) {
                return $09 + $08;
            } else {
                return "";
            }
        };
        this.deleteEvents = function() {
            if (this.elements.events) {
                for (var i = 0; i < this.elements.events.length; i++) {
                    var $X = this.elements.events[i];
                    var $w = $X.event;
                    if ($w) {
                        $w.calendar = null;
                    };
                    $X.onclick = null;
                    $X.onclickSave = null;
                    $X.onmouseover = null;
                    $X.onmouseout = null;
                    $X.onmousemove = null;
                    $X.onmousedown = null;
                    if ($X.firstChild && $X.firstChild.firstChild && $X.firstChild.firstChild.tagName && $X.firstChild.firstChild.tagName.toUpperCase() === 'IMG') {
                        var $0a = $X.firstChild.firstChild;
                        $0a.onmousedown = null;
                        $0a.onmousemove = null;
                        $0a.onclick = null;
                    };
                    $X.helper = null;
                    $X.data = null;
                    $X.event = null;
                    DayPilot.de($X);
                }
            };
            this.elements.events = [];
        };
        this.$1O = function(e) {
            var $0b = this.nav.events;
            var $0c = true;
            var $0d = true;
            var $0e = false;
            var $0f = this.eventBorderColor;
            var $X = document.createElement("div");
            $X.style.position = 'absolute';
            $X.style.left = e.part.left + '%';
            $X.style.top = (e.part.top) + 'px';
            $X.style.width = e.part.width + '%';
            $X.style.height = Math.max(e.part.height, 2) + 'px';
            $X.style.overflow = 'hidden';
            $X.data = e;
            $X.event = e;
            $X.unselectable = 'on';
            $X.style.MozUserSelect = 'none';
            $X.style.KhtmlUserSelect = 'none';
            $X.className = this.$1N("_event");
            if (e.data.cssClass) {
                DayPilot.Util.addClass($X, e.data.cssClass);
            };
            $X.isFirst = e.part.start.getTime() === e.start().getTime();
            $X.isLast = e.part.end.getTime() === e.end().getTime();
            $X.onclick = this.eventClickDispatch;
            $X.onmousemove = function(ev) {
                var $0g = 5;
                var $0h = $c.eventHeaderVisible ? ($c.eventHeaderHeight) : 10;
                if (typeof(DayPilotCalendar) === 'undefined') {
                    return;
                };
                var $0i = DayPilot.mo3($X, ev);
                if (!$0i) {
                    return;
                };
                if (DayPilotCalendar.resizing || DayPilotCalendar.moving) {
                    return;
                };
                var $0j = this.isLast;
                if ($0i.y <= $0h && $c.eventResizeHandling !== 'Disabled') {
                    this.style.cursor = "n-resize";
                    this.dpBorder = 'top';
                } else if (this.offsetHeight - $0i.y <= $0g && $c.eventResizeHandling !== 'Disabled') {
                    if ($0j) {
                        this.style.cursor = "s-resize";
                        this.dpBorder = 'bottom';
                    } else {
                        this.style.cursor = 'not-allowed';
                    }
                } else if (!DayPilotCalendar.resizing && !DayPilotCalendar.moving) {
                    if ($c.eventClickHandling !== 'Disabled') {
                        this.style.cursor = 'pointer';
                    } else {
                        this.style.cursor = 'default';
                    }
                }
            };
            $X.onmousedown = function(ev) {
                ev = ev || window.event;
                var $V = ev.which || ev.button;
                if ((this.style.cursor === 'n-resize' || this.style.cursor === 's-resize') && $V === 1) {
                    DayPilotCalendar.resizing = this;
                    DayPilotCalendar.originalMouse = DayPilot.mc(ev);
                    DayPilotCalendar.originalHeight = this.offsetHeight;
                    DayPilotCalendar.originalTop = this.offsetTop;
                    $c.nav.top.style.cursor = this.style.cursor;
                } else if ($V === 1 && $c.eventMoveHandling !== 'Disabled') {
                    DayPilotCalendar.moving = this;
                    DayPilotCalendar.moving.event = this.event;
                    var $0k = DayPilotCalendar.moving.helper = {};
                    $0k.oldColumn = $c.columns[this.data.part.dayIndex].Value;
                    DayPilotCalendar.originalMouse = DayPilot.mc(ev);
                    DayPilotCalendar.originalTop = this.offsetTop;
                    var $0i = DayPilot.mo3(this, ev);
                    if ($0i) {
                        DayPilotCalendar.moveOffsetY = $0i.y;
                    } else {
                        DayPilotCalendar.moveOffsetY = 0;
                    };
                    $c.nav.top.style.cursor = 'move';
                };
                return false;
            };
            var $0l = document.createElement("div");
            $0l.setAttribute("unselectable", "on");
            $0l.className = $c.$1N("_event_inner");
            $0l.innerHTML = e.client.html();
            if (e.data.backColor) {
                $0l.style.background = e.data.backColor;
                if (DayPilot.browser.ie9 || DayPilot.browser.ielt9) {
                    $0l.style.filter = '';
                }
            };
            $X.appendChild($0l);
            if (e.client.barVisible()) {
                var $h = e.part.height - 2;
                var $0m = 100 * e.part.barTop / $h;
                var $0n = Math.ceil(100 * e.part.barHeight / $h);
                var $0o = document.createElement("div");
                $0o.setAttribute("unselectable", "on");
                $0o.className = this.$1N("_event_bar");
                $0o.style.position = "absolute";
                if (e.data.barBackColor) {
                    $0o.style.backgroundColor = e.data.barBackColor;
                };
                var $0p = document.createElement("div");
                $0p.setAttribute("unselectable", "on");
                $0p.className = this.$1N("_event_bar_inner");
                $0p.style.top = $0m + "%";
                if (0 < $0n && $0n <= 1) {
                    $0p.style.height = "1px";
                } else {
                    $0p.style.height = $0n + "%";
                };
                if (e.data.barColor) {
                    $0p.style.backgroundColor = e.data.barColor;
                };
                $0o.appendChild($0p);
                $X.appendChild($0o);
            };
            if ($0b.rows[0].cells[e.part.dayIndex]) {
                var $0q = $0b.rows[0].cells[e.part.dayIndex].firstChild;
                $0q.appendChild($X);
                $c.makeChildrenUnselectable($X);
            };
            $c.elements.events.push($X);
        };
        this.makeChildrenUnselectable = function(el) {
            var c = (el && el.childNodes) ? el.childNodes.length : 0;
            for (var i = 0; i < c; i++) {
                try {
                    var $0r = el.childNodes[i];
                    if ($0r.nodeType === 1) {
                        $0r.unselectable = 'on';
                        this.makeChildrenUnselectable($0r);
                    }
                } catch (e) {}
            }
        };
        this.drawEvents = function() {
            for (var i = 0; i < this.columns.length; i++) {
                var $0s = this.columns[i];
                if (!$0s.blocks) {
                    continue;
                };
                for (var m = 0; m < $0s.blocks.length; m++) {
                    var $00 = $0s.blocks[m];
                    for (var j = 0; j < $00.lines.length; j++) {
                        var $03 = $00.lines[j];
                        for (var k = 0; k < $03.length; k++) {
                            var e = $03[k];
                            e.part.width = 100 / $00.lines.length;
                            e.part.left = e.part.width * j;
                            var $0t = (j === $00.lines.length - 1);
                            if (!$0t) {
                                e.part.width = e.part.width * 1.5;
                            };
                            this.$1O(e);
                        }
                    }
                }
            }
        };
        this.drawTop = function() {
            this.nav.top.innerHTML = '';
            if (this.cssOnly) {
                DayPilot.Util.addClass(this.nav.top, this.$1N("_main"));
            } else {
                this.nav.top.style.lineHeight = "1.2";
                this.nav.top.style.textAlign = "left";
            };
            this.nav.top.style.MozUserSelect = 'none';
            this.nav.top.style.KhtmlUserSelect = 'none';
            this.nav.top.style.position = 'relative';
            this.nav.top.style.width = this.width ? this.width : '100%';
            if (this.hideUntilInit) {
                this.nav.top.style.visibility = 'hidden';
            };
            if (!this.visible) {
                this.nav.top.style.display = "none";
            };
            this.nav.scroll = document.createElement("div");
            this.nav.scroll.style.height = this.getScrollableHeight() + "px";
            if (this.heightSpec === 'BusinessHours') {
                this.nav.scroll.style.overflow = "auto";
            } else {
                this.nav.scroll.style.overflow = "hidden";
            };
            this.nav.scroll.style.position = "relative";
            if (!this.cssOnly) {
                this.nav.scroll.style.border = "1px solid " + this.borderColor;
                this.nav.scroll.style.backgroundColor = this.hourNameBackColor;
            };
            var $0u = this.drawTopHeaderDiv();
            this.nav.top.appendChild($0u);
            this.nav.scroll.style.zoom = 1;
            var $0v = this.drawScrollable();
            this.nav.scrollable = $0v.firstChild;
            this.nav.scroll.appendChild($0v);
            this.nav.top.appendChild(this.nav.scroll);
            this.nav.scrollLayer = document.createElement("div");
            this.nav.scrollLayer.style.position = 'absolute';
            this.nav.scrollLayer.style.top = '0px';
            this.nav.scrollLayer.style.left = '0px';
            this.nav.top.appendChild(this.nav.scrollLayer);
            this.nav.loading = document.createElement("div");
            this.nav.loading.style.position = 'absolute';
            this.nav.loading.style.top = '0px';
            this.nav.loading.style.left = (this.hourWidth + 5) + "px";
            this.nav.loading.style.backgroundColor = this.loadingLabelBackColor;
            this.nav.loading.style.fontSize = this.loadingLabelFontSize;
            this.nav.loading.style.fontFamily = this.loadingLabelFontFamily;
            this.nav.loading.style.color = this.loadingLabelFontColor;
            this.nav.loading.style.padding = '2px';
            this.nav.loading.innerHTML = this.loadingLabelText;
            this.nav.loading.style.display = 'none';
            this.nav.top.appendChild(this.nav.loading);
        };
        this.drawHourTable = function() {
            if (!this.fasterDispose) DayPilot.pu(this.nav.hourTable);
            this.nav.scrollable.rows[0].cells[0].innerHTML = '';
            this.nav.hourTable = this.createHourTable();
            this.nav.scrollable.rows[0].cells[0].appendChild(this.nav.hourTable);
        };
        this.drawScrollable = function() {
            var $0w = document.createElement("div");
            $0w.style.zoom = 1;
            $0w.style.position = 'relative';
            var $0x = document.createElement("table");
            $0x.cellSpacing = "0";
            $0x.cellPadding = "0";
            $0x.border = "0";
            $0x.style.border = "0px none";
            $0x.style.width = "100%";
            $0x.style.position = 'absolute';
            var r = $0x.insertRow(-1);
            var c;
            c = r.insertCell(-1);
            c.valign = "top";
            c.style.padding = '0px';
            c.style.border = '0px none';
            this.nav.hourTable = this.createHourTable();
            c.appendChild(this.nav.hourTable);
            c = r.insertCell(-1);
            c.valign = "top";
            c.width = "100%";
            c.style.padding = '0px';
            c.style.border = '0px none';
            if (!this.cssOnly) {
                c.appendChild(this.createEventsAndCells());
            } else {
                var $0v = document.createElement("div");
                $0v.style.position = "relative";
                c.appendChild($0v);
                $0v.appendChild(this.createEventsAndCells());
                $0v.appendChild(this.$1P());
            };
            $0w.appendChild($0x);
            this.nav.zoom = $0w;
            return $0w;
        };
        this.createEventsAndCells = function() {
            var $0x = document.createElement("table");
            $0x.cellPadding = "0";
            $0x.cellSpacing = "0";
            $0x.border = "0";
            $0x.style.width = "100%";
            $0x.style.border = "0px none";
            $0x.style.tableLayout = 'fixed';
            if (!this.cssOnly) {
                $0x.style.borderLeft = "1px solid " + this.borderColor;
            };
            this.nav.main = $0x;
            this.nav.events = $0x;
            return $0x;
        };
        this.$1P = function() {
            var $0x = document.createElement("table");
            $0x.style.top = "0px";
            $0x.cellPadding = "0";
            $0x.cellSpacing = "0";
            $0x.border = "0";
            $0x.style.position = "absolute";
            $0x.style.width = "100%";
            $0x.style.border = "0px none";
            $0x.style.tableLayout = 'fixed';
            this.nav.events = $0x;
            var $0y = true;
            var $05 = this.columns;
            var cl = $05.length;
            var r = ($0y) ? $0x.insertRow(-1) : $0x.rows[0];
            for (var j = 0; j < cl; j++) {
                var c = ($0y) ? r.insertCell(-1) : r.cells[j];
                if ($0y) {
                    c.style.padding = '0px';
                    c.style.border = '0px none';
                    c.style.height = '0px';
                    c.style.overflow = 'visible';
                    if (!$c.rtl) {
                        c.style.textAlign = 'left';
                    };
                    var $X = document.createElement("div");
                    $X.style.marginRight = $c.columnMarginRight + "px";
                    $X.style.position = 'relative';
                    $X.style.height = '1px';
                    if (!this.cssOnly) {
                        $X.style.fontSize = '1px';
                        $X.style.lineHeight = '1.2';
                    };
                    $X.style.marginTop = '-1px';
                    c.appendChild($X);
                }
            };
            return $0x;
        };
        this.createHourTable = function() {
            var $0x = document.createElement("table");
            $0x.cellSpacing = "0";
            $0x.cellPadding = "0";
            $0x.border = "0";
            $0x.style.border = '0px none';
            $0x.style.width = this.hourWidth + "px";
            $0x.oncontextmenu = function() {
                return false;
            };
            var $0z = this.cssOnly ? 0 : 1;
            if ($0z) {
                var r = $0x.insertRow(-1);
                r.style.height = "1px";
                r.style.backgroundColor = "white";
                var c = r.insertCell(-1);
                c.style.padding = '0px';
                c.style.border = '0px none';
            };
            var $0A = 24;
            for (var i = 0; i < $0A; i++) {
                this.createHourRow($0x, i);
            };
            return $0x;
        };
        this.createHourRow = function($0x, i) {
            var $h = (this.cellHeight * 2);
            var r = $0x.insertRow(-1);
            r.style.height = $h + "px";
            var c = r.insertCell(-1);
            c.valign = "bottom";
            c.unselectable = "on";
            if (!this.cssOnly) {
                c.style.backgroundColor = this.hourNameBackColor;
            };
            c.style.cursor = "default";
            c.style.padding = '0px';
            c.style.border = '0px none';
            var $0B = document.createElement("div");
            $0B.style.position = "relative";
            if (this.cssOnly) {
                $0B.className = this.$1N("_rowheader");
            };
            $0B.style.width = this.hourWidth + "px";
            $0B.style.height = ($h) + "px";
            $0B.style.overflow = 'hidden';
            $0B.unselectable = 'on';
            var $00 = document.createElement("div");
            if (this.cssOnly) {
                $00.className = this.$1N("_rowheader_inner");
            } else {
                $00.style.borderBottom = "1px solid " + this.hourNameBorderColor;
                $00.style.textAlign = "right";
            };
            $00.style.height = ($h - 1) + "px";
            $00.unselectable = "on";
            var $0C = document.createElement("div");
            if (!this.cssOnly) {
                $0C.style.padding = "2px";
                $0C.style.fontFamily = this.hourFontFamily;
                $0C.style.fontSize = this.hourFontSize;
                $0C.style.color = this.hourFontColor;
            };
            $0C.unselectable = "on";
            var $J = this.startDate.addHours(i);
            var $0D = $J.getHours();
            var am = $0D < 12;
            var $0E = $A.timeFormat();
            if ($0E === "Clock12Hours") {
                $0D = $0D % 12;
                if ($0D === 0) {
                    $0D = 12;
                }
            };
            $0C.innerHTML = $0D;
            var $0F = document.createElement("span");
            $0F.unselectable = "on";
            if (!this.cssOnly) {
                $0F.style.fontSize = "10px";
                $0F.style.verticalAlign = "super";
            } else {
                $0F.className = this.$1N("_rowheader_minutes");
            };
            var $0G;
            if ($0E === "Clock12Hours") {
                if (am) {
                    $0G = "AM";
                } else {
                    $0G = "PM";
                }
            } else {
                $0G = "00";
            };
            if (!this.cssOnly) {
                $0F.innerHTML = "&nbsp;" + $0G;
            } else {
                $0F.innerHTML = $0G;
            };
            $0C.appendChild($0F);
            $00.appendChild($0C);
            $0B.appendChild($00);
            c.appendChild($0B);
        };
        this.getScrollableHeight = function() {
            switch (this.heightSpec) {
                case "Full":
                    return (24 * 2 * this.cellHeight);
                case "BusinessHours":
                    var $0H = this.businessHoursSpan();
                    return $0H * this.cellHeight * 2;
                case "BusinessHoursNoScroll":
                    var $0H = this.businessHoursSpan();
                    return $0H * this.cellHeight * 2;
                default:
                    throw "DayPilot.Calendar: Unexpected 'heightSpec' value.";
            }
        };
        this.$1Q = function() {
            var parent = $c.nav.corner ? $c.nav.corner.parentNode : null;
            if (!parent) {
                return;
            };
            parent.innerHTML = '';
            var $0I = this.drawCorner();
            parent.appendChild($0I);
            $c.nav.corner = $0I;
        };
        this.drawTopHeaderDiv = function() {
            var $0u = document.createElement("div");
            if (!this.cssOnly) {
                $0u.style.borderLeft = "1px solid " + this.borderColor;
                $0u.style.borderRight = "1px solid " + this.borderColor;
            };
            $0u.style.overflow = "auto";
            var $0x = document.createElement("table");
            $0x.cellPadding = "0";
            $0x.cellSpacing = "0";
            $0x.border = "0";
            $0x.style.width = "100%";
            $0x.style.borderCollapse = 'separate';
            $0x.style.border = "0px none";
            var r = $0x.insertRow(-1);
            var c = r.insertCell(-1);
            c.style.padding = '0px';
            c.style.border = '0px none';
            var $0I = this.drawCorner();
            c.appendChild($0I);
            this.nav.corner = $0I;
            c = r.insertCell(-1);
            c.style.width = "100%";
            if (!this.cssOnly) {
                c.style.backgroundColor = this.hourNameBackColor;
            };
            c.valign = "top";
            c.style.position = 'relative';
            c.style.padding = '0px';
            c.style.border = '0px none';
            this.nav.header = document.createElement("table");
            this.nav.header.cellPadding = "0";
            this.nav.header.cellSpacing = "0";
            this.nav.header.border = "0";
            this.nav.header.width = "100%";
            this.nav.header.style.tableLayout = "fixed";
            if (!this.cssOnly) {
                this.nav.header.style.borderBottom = "0px none #000000";
                this.nav.header.style.borderRight = "0px none #000000";
                this.nav.header.style.borderLeft = "1px solid " + this.borderColor;
                this.nav.header.style.borderTop = "1px solid " + this.borderColor;
            };
            this.nav.header.oncontextmenu = function() {
                return false;
            };
            var $0J = this.nav.scroll.style.overflow !== 'hidden';
            if (!this.cssOnly) {
                if ($0J) {
                    this.nav.header.style.borderRight = "1px solid " + this.borderColor;
                }
            };
            c.appendChild(this.nav.header);
            if ($0J) {
                c = r.insertCell(-1);
                c.unselectable = "on";
                if (!this.cssOnly) {
                    c.style.backgroundColor = this.hourNameBackColor;
                    c.style.borderTop = "1px solid " + this.borderColor;
                    c.style.borderBottom = "0px none";
                    c.style.borderLeft = "0px none";
                    c.style.borderRight = "0px none";
                    c.style.padding = '0px';
                    c.style.verticalAlign = 'top';
                    c.innerHTML = "&nbsp;";
                };
                var $0K = document.createElement("div");
                $0K.unselectable = "on";
                $0K.style.position = "relative";
                $0K.style.width = "16px";
                if (!this.cssOnly) {
                    $0K.style.lineHeight = "1px";
                    $0K.style.fontSize = "1px";
                    $0K.style.height = "1px";
                } else {
                    $0K.style.height = this.headerHeight + "px";
                    $0K.className = this.$1N("_cornerright");
                    var $0l = document.createElement("div");
                    $0l.className = this.$1N('_cornerright_inner');
                    $0K.appendChild($0l);
                };
                c.appendChild($0K);
                this.nav.cornerRight = $0K;
            };
            $0u.appendChild($0x);
            return $0u;
        };
        this.drawCorner = function() {
            var $0v = document.createElement("div");
            $0v.style.position = 'relative';
            if (this.cssOnly) {
                $0v.className = this.$1N("_corner");
            } else {
                $0v.style.backgroundColor = this.hourNameBackColor;
                $0v.style.fontFamily = this.headerFontFamily;
                $0v.style.fontSize = this.headerFontSize;
                $0v.style.color = this.headerFontColor;
                $0v.style.borderTop = "1px solid " + this.borderColor;
            };
            $0v.style.width = this.hourWidth + "px";
            $0v.style.height = this.headerHeight + "px";
            $0v.oncontextmenu = function() {
                return false;
            };
            var $0I = document.createElement("div");
            $0I.unselectable = "on";
            if (this.cssOnly) {
                $0I.className = this.$1N("_corner_inner");
            };
            $0v.appendChild($0I);
            return $0v;
        };
        this.disposeMain = function() {
            var $0x = this.nav.main;
            $0x.root = null;
            $0x.onmouseup = null;
            for (var y = 0; y < $0x.rows.length; y++) {
                var r = $0x.rows[y];
                for (var x = 0; x < r.cells.length; x++) {
                    var c = r.cells[x];
                    c.root = null;
                    c.onmousedown = null;
                    c.onmousemove = null;
                    c.onmouseout = null;
                    c.onmouseup = null;
                }
            };
            if (!this.fasterDispose) DayPilot.pu($0x);
        };
        this.drawMain = function() {
            var $0L = [];
            var $0M = [];
            var $0x = this.nav.main;
            var $L = 30 * 60 * 1000;
            var $0N = this.rowCount();
            var $05 = $c.columns;
            var $0y = true;
            if ($0x) {
                this.disposeMain();
            }
            while ($0x && $0x.rows && $0x.rows.length > 0 && $0y) {
                if (!this.fasterDispose) {
                    DayPilot.pu($0x.rows[0]);
                };
                $0x.deleteRow(0);
            };
            this.tableCreated = true;
            var cl = $05.length;
            if (this.cssOnly) {
                var $0O = this.nav.events;
                while ($0O && $0O.rows && $0O.rows.length > 0 && $0y) {
                    if (!this.fasterDispose) {
                        DayPilot.pu($0O.rows[0]);
                    };
                    $0O.deleteRow(0);
                };
                var cl = $05.length;
                var r = ($0y) ? $0O.insertRow(-1) : $0O.rows[0];
                for (var j = 0; j < cl; j++) {
                    var c = ($0y) ? r.insertCell(-1) : r.cells[j];
                    if ($0y) {
                        c.style.padding = '0px';
                        c.style.border = '0px none';
                        c.style.height = '0px';
                        c.style.overflow = 'visible';
                        if (!$c.rtl) {
                            c.style.textAlign = 'left';
                        };
                        var $X = document.createElement("div");
                        $X.style.marginRight = $c.columnMarginRight + "px";
                        $X.style.position = 'relative';
                        $X.style.height = '1px';
                        if (!this.cssOnly) {
                            $X.style.fontSize = '1px';
                            $X.style.lineHeight = '1.2';
                        };
                        $X.style.marginTop = '-1px';
                        c.appendChild($X);
                    }
                }
            };
            if (!this.cssOnly) {
                var r = ($0y) ? $0x.insertRow(-1) : $0x.rows[0];
                if ($0y) {
                    r.style.backgroundColor = 'white';
                };
                for (var j = 0; j < cl; j++) {
                    var c = ($0y) ? r.insertCell(-1) : r.cells[j];
                    if ($0y) {
                        c.style.padding = '0px';
                        c.style.border = '0px none';
                        c.style.height = '1px';
                        c.style.overflow = 'visible';
                        c.style.width = (100.0 / $05.length) + "%";
                        var $X = document.createElement("div");
                        $X.style.display = 'block';
                        $X.style.marginRight = $c.columnMarginRight + "px";
                        $X.style.position = 'relative';
                        $X.style.height = '1px';
                        $X.style.fontSize = '1px';
                        $X.style.lineHeight = '1.2';
                        $X.style.marginTop = '-1px';
                        c.appendChild($X);
                    }
                }
            };
            for (var i = 0; i < $0N; i++) {
                var $0z = this.cssOnly ? 0 : 1;
                var r = ($0y) ? $0x.insertRow(-1) : $0x.rows[i + $0z];
                if ($0y) {
                    r.style.MozUserSelect = 'none';
                    r.style.KhtmlUserSelect = 'none';
                };
                for (var j = 0; j < cl; j++) {
                    var $0s = this.columns[j];
                    var c = ($0y) ? r.insertCell(-1) : r.cells[j];
                    c.start = $0s.Start.addTime(i * $L);
                    c.end = c.start.addTime($L);
                    c.onmousedown = this.onCellMousedown;
                    c.onmousemove = this.mousemove;
                    c.onmouseup = function() {
                        return false;
                    };
                    c.onclick = function() {
                        return false;
                    };
                    if ($0y) {
                        c.root = this;
                        c.style.padding = '0px';
                        c.style.border = '0px none';
                        c.style.verticalAlign = 'top';
                        if (!this.cssOnly) {
                            if (j !== cl - 1) {
                                c.style.borderRight = '1px solid ' + $c.cellBorderColor;
                            }
                        };
                        c.style.height = $c.cellHeight + 'px';
                        c.style.overflow = 'hidden';
                        c.unselectable = 'on';
                        if (!this.cssOnly) {
                            var $X = document.createElement("div");
                            $X.unselectable = 'on';
                            $X.style.fontSize = '1px';
                            $X.style.height = '0px';
                            var $0P = (c.end.getMinutes() + c.end.getSeconds() + c.end.getMilliseconds()) > 0;
                            if ($0P) {
                                if ($c.hourHalfBorderColor !== '') {
                                    $X.style.borderBottom = '1px solid ' + $c.hourHalfBorderColor;
                                }
                            } else {
                                if ($c.hourBorderColor !== '') {
                                    $X.style.borderBottom = '1px solid ' + $c.hourBorderColor;
                                }
                            };
                            var $0Q = document.createElement("div");
                            $0Q.style.height = ($c.cellHeight - 1) + "px";
                            $0Q.style.overflow = 'hidden';
                            $0Q.unselectable = 'on';
                            c.appendChild($0Q);
                        } else {
                            var $X = document.createElement("div");
                            $X.unselectable = 'on';
                            $X.style.height = $c.cellHeight + "px";
                            $X.style.position = "relative";
                            $X.className = this.$1N("_cell");
                            var $0R = this.$1R(c.start, c.end);
                            if ($0R && this.cssOnly) {
                                DayPilot.Util.addClass($X, $c.$1N("_cell_business"));
                            };
                            var $0l = document.createElement("div");
                            $0l.setAttribute("unselectable", "on");
                            $0l.className = this.$1N("_cell_inner");
                            $X.appendChild($0l);
                            c.appendChild($X);
                        };
                        c.appendChild($X);
                    };
                    c.style.backgroundColor = $c.cellBackColor;
                    $0Q = c.firstChild;
                }
            };
            $0x.onmouseup = this.mouseup;
            $0x.root = this;
            $c.nav.scrollable.onmousemove = function(ev) {
                ev = ev || window.event;
                var $0S = $c.nav.scrollable;
                $c.coords = DayPilot.mo3($0S, ev);
                var $Y = DayPilot.mc(ev);
                if (DayPilotCalendar.resizing) {
                    if (!DayPilotCalendar.resizingShadow) {
                        DayPilotCalendar.resizingShadow = $c.createShadow(DayPilotCalendar.resizing, false, $c.shadow);
                    };
                    var $0T = $c.cellHeight;
                    var $I = 1;
                    var $0U = ($Y.y - DayPilotCalendar.originalMouse.y);
                    if (DayPilotCalendar.resizing.dpBorder === 'bottom') {
                        var $0V = Math.floor(((DayPilotCalendar.originalHeight + DayPilotCalendar.originalTop + $0U) + $0T / 2) / $0T) * $0T - DayPilotCalendar.originalTop + $I;
                        if ($0V < $0T) $0V = $0T;
                        var $04 = $c.nav.main.clientHeight;
                        if (DayPilotCalendar.originalTop + $0V > $04) $0V = $04 - DayPilotCalendar.originalTop;
                        DayPilotCalendar.resizingShadow.style.height = ($0V - 4) + 'px';
                    } else if (DayPilotCalendar.resizing.dpBorder === 'top') {
                        var $0W = Math.floor(((DayPilotCalendar.originalTop + $0U - $I) + $0T / 2) / $0T) * $0T + $I;
                        if ($0W < $I) {
                            $0W = $I;
                        };
                        if ($0W > DayPilotCalendar.originalTop + DayPilotCalendar.originalHeight - $0T) {
                            $0W = DayPilotCalendar.originalTop + DayPilotCalendar.originalHeight - $0T;
                        };
                        var $0V = DayPilotCalendar.originalHeight - ($0W - DayPilotCalendar.originalTop) - 4;
                        if ($0V < $0T) {
                            $0V = $0T;
                        } else {
                            DayPilotCalendar.resizingShadow.style.top = $0W + 'px';
                        };
                        DayPilotCalendar.resizingShadow.style.height = ($0V) + 'px';
                    }
                } else if (DayPilotCalendar.moving) {
                    if (!DayPilotCalendar.movingShadow) {
                        DayPilotCalendar.movingShadow = $c.createShadow(DayPilotCalendar.moving, !$c.ie, $c.shadow);
                        DayPilotCalendar.movingShadow.style.width = (DayPilotCalendar.movingShadow.parentNode.offsetWidth + 1) + 'px';
                    };
                    if (!$c.coords) {
                        return;
                    };
                    var $0T = $c.cellHeight;
                    var $I = 1;
                    var $0i = DayPilotCalendar.moveOffsetY;
                    if (!$0i) {
                        $0i = $0T / 2;
                    };
                    var $0W = Math.floor((($c.coords.y - $0i - $I) + $0T / 2) / $0T) * $0T + $I;
                    if ($0W < $I) {
                        $0W = $I;
                    };
                    var $0b = $c.nav.events;
                    var $04 = $c.nav.main.clientHeight;
                    var $h = parseInt(DayPilotCalendar.movingShadow.style.height);
                    if ($0W + $h > $04) {
                        $0W = $04 - $h;
                    };
                    DayPilotCalendar.movingShadow.parentNode.style.display = 'none';
                    DayPilotCalendar.movingShadow.style.top = $0W + 'px';
                    DayPilotCalendar.movingShadow.parentNode.style.display = '';
                    var $0X = $0b.clientWidth / $0b.rows[0].cells.length;
                    var $m = Math.floor(($c.coords.x - 45) / $0X);
                    if ($m < 0) {
                        $m = 0;
                    };
                    if ($m < $0b.rows[0].cells.length && $m >= 0 && DayPilotCalendar.movingShadow.column !== $m) {
                        DayPilotCalendar.movingShadow.column = $m;
                        DayPilotCalendar.moveShadow($0b.rows[0].cells[$m]);
                    }
                }
            };
            $c.nav.scrollable.style.display = '';
        };
        this.$1R = function($J, end) {
            if (this.businessBeginsHour < this.businessEndsHour) {
                return !($J.getHours() < this.businessBeginsHour || $J.getHours() >= this.businessEndsHour || $J.getDayOfWeek() === 6 || $J.getDayOfWeek() === 0);
            };
            if ($J.getHours() >= this.businessBeginsHour) {
                return true;
            };
            if ($J.getHours() < this.businessEndsHour) {
                return true;
            };
            return false;
        };
        this.disposeHeader = function() {
            var $0x = this.nav.header;
            if ($0x && $0x.rows) {
                for (var y = 0; y < $0x.rows.length; y++) {
                    var r = $0x.rows[y];
                    for (var x = 0; x < r.cells.length; x++) {
                        var c = r.cells[x];
                        c.onclick = null;
                        c.onmousemove = null;
                        c.onmouseout = null;
                    }
                }
            };
            if (!this.fasterDispose) DayPilot.pu($0x);
        };
        this.drawHeaderRow = function($0y) {
            var r = ($0y) ? this.nav.header.insertRow(-1) : this.nav.header.rows[0];
            var $05 = this.columns;
            var $0Y = $05.length;
            for (var i = 0; i < $0Y; i++) {
                var $p = $05[i];
                var $d = ($0y) ? r.insertCell(-1) : r.cells[i];
                $d.data = $p;
                $d.style.overflow = 'hidden';
                $d.style.padding = '0px';
                $d.style.border = '0px none';
                $d.style.height = (this.headerHeight) + "px";
                var $X = ($0y) ? document.createElement("div") : $d.firstChild;
                if ($0y) {
                    $X.unselectable = 'on';
                    $X.style.MozUserSelect = 'none';
                    $X.style.backgroundColor = $p.BackColor;
                    $X.style.cursor = 'default';
                    $X.style.position = 'relative';
                    if (!this.cssOnly) {
                        $X.style.fontFamily = this.headerFontFamily;
                        $X.style.fontSize = this.headerFontSize;
                        $X.style.color = this.headerFontColor;
                        if (i !== $0Y - 1) {
                            $X.style.borderRight = "1px solid " + this.borderColor;
                        }
                    } else {
                        $X.className = $c.$1N('_colheader');
                    };
                    $X.style.height = this.headerHeight + "px";
                    var $0C = document.createElement("div");
                    if (!this.cssOnly) {
                        $0C.style.position = 'absolute';
                        $0C.style.left = '0px';
                        $0C.style.width = '100%';
                        $0C.style.padding = "2px";
                        $X.style.textAlign = 'center';
                    } else {
                        $0C.className = $c.$1N('_colheader_inner');
                    };
                    $0C.unselectable = 'on';
                    $X.appendChild($0C);
                    $d.appendChild($X);
                };
                var $0C = $X.firstChild;
                $0C.innerHTML = $p.InnerHTML;
            }
        };
        this.widthUnit = function() {
            if (this.width && this.width.indexOf("px") !== -1) {
                return "Pixel";
            };
            return "Percentage";
        };
        this.drawHeader = function() {
            var $0u = this.nav.header;
            var $0y = true;
            var $05 = this.columns;
            var $0Y = $05.length;
            while (this.headerCreated && $0u && $0u.rows && $0u.rows.length > 0 && $0y) {
                if (!this.fasterDispose) DayPilot.pu($0u.rows[0]);
                $0u.deleteRow(0);
            };
            this.headerCreated = true;
            if (!$0y) {
                var $0I = $c.nav.corner;
                if (!this.cssOnly) {
                    $0I.style.backgroundColor = $c.cornerBackColor;
                };
                if (!this.fasterDispose) DayPilot.pu($0I.firstChild);
            };
            this.drawHeaderRow($0y);
        };
        this.loadingStart = function() {
            if (this.loadingLabelVisible) {
                this.nav.loading.innerHTML = this.loadingLabelText;
                this.nav.loading.style.top = (this.headerHeight + 5) + "px";
                this.nav.loading.style.display = '';
            }
        };
        this.commandCallBack = function($0Z, $p) {
            var $F = {};
            $F.command = $0Z;
            this.$1H('Command', $p, $F);
        };
        this.loadingStop = function($10) {
            if (this.callbackTimeout) {
                window.clearTimeout(this.callbackTimeout);
            };
            this.nav.loading.style.display = 'none';
        };
        this.enableScrolling = function() {
            var $11 = this.nav.scroll;
            var $12 = (typeof this.$1S.scrollpos !== 'undefined') ? this.$1S.scrollpos : this.initScrollPos;
            if (!$12) {
                return;
            };
            if ($12 === 'Auto') {
                if (this.heightSpec === "BusinessHours") {
                    $12 = 2 * this.cellHeight * this.businessBeginsHour;
                } else {
                    $12 = 0;
                }
            };
            $11.root = this;
            if ($11.scrollTop === 0) {
                $11.scrollTop = $12;
            }
        };
        this.callbackError = function($t, $u) {
            alert("Error!\r\nResult: " + $t + "\r\nContext:" + $u);
        };
        this.fixScrollHeader = function() {
            var w = DayPilot.sw(this.nav.scroll);
            var d = this.nav.cornerRight;
            if (d && w > 0) {
                if (this.cssOnly) {
                    d.style.width = w + 'px';
                } else {
                    d.style.width = (w - 3) + 'px';
                }
            }
        };
        this.registerGlobalHandlers = function() {
            if (!DayPilotCalendar.globalHandlers) {
                DayPilotCalendar.globalHandlers = true;
                DayPilot.re(document, 'mouseup', DayPilotCalendar.gMouseUp);
                DayPilot.re(window, 'unload', DayPilotCalendar.gUnload);
            }
        };
        this.events = {};
        this.events.add = function(e) {
            e.calendar = $c;
            if (!$c.events.list) {
                $c.events.list = [];
            };
            $c.events.list.push(e.data);
            $c.update();
            $c.$1L.notify();
        };
        this.events.update = function(e) {
            e.commit();
            $c.update();
            $c.$1L.notify();
        };
        this.events.remove = function(e) {
            var $13 = DayPilot.indexOf($c.events.list, e.data);
            $c.events.list.splice($13, 1);
            $c.update();
            $c.$1L.notify();
        };
        this.update = function() {
            $c.$1T();
            $c.prepareVariables();
            $c.deleteEvents();
            var $14 = true;
            if ($14) {
                $c.prepareColumns();
                $c.drawHeader();
                $c.drawMain();
                $c.drawHourTable();
                $c.updateHeight();
                $c.$1Q();
            };
            $c.loadEvents();
            $c.updateHeaderHeight();
            $c.$1J();
            $c.drawEvents();
            $c.clearSelection();
            if (this.visible) {
                this.show();
            } else {
                this.hide();
            }
        };
        this.$1U = function() {
            if (this.id && this.id.tagName) {
                this.nav.top = this.id;
            } else if (typeof this.id === "string") {
                this.nav.top = document.getElementById(this.id);
                if (!this.nav.top) {
                    throw "DayPilot.Calendar: The placeholder element not found: '" + id + "'.";
                }
            } else {
                throw "DayPilot.Calendar() constructor requires the target element or its ID as a parameter";
            }
        };
        this.loadEvents = function() {
            var $0O = this.events.list;
            if (!$0O) {
                return;
            };
            var length = $0O.length;
            var $15 = 24 * 60 * 60 * 1000;
            this.cache.pixels = {};
            var $16 = [];
            this.scrollLabels = [];
            this.minStart = 10000;
            this.maxEnd = 0;
            for (var i = 0; i < length; i++) {
                var e = $0O[i];
                e.start = new DayPilot.Date(e.start);
                e.end = new DayPilot.Date(e.end);
            };
            for (var i = 0; i < this.columns.length; i++) {
                var scroll = {};
                scroll.minEnd = 1000000;
                scroll.maxStart = -1;
                this.scrollLabels.push(scroll);
                var $0s = this.columns[i];
                $0s.events = [];
                $0s.lines = [];
                $0s.blocks = [];
                var $17 = new DayPilot.Date($0s.Start);
                var $18 = $17.getTime();
                var $19 = $17.addTime($15);
                var $1a = $19.getTime();
                for (var j = 0; j < length; j++) {
                    if ($16[j]) {
                        continue;
                    };
                    var e = $0O[j];
                    var $J = e.start;
                    var end = e.end;
                    var $1b = $J.getTime();
                    var $1c = end.getTime();
                    if ($1c < $1b) {
                        continue;
                    };
                    var $1d = !($1c <= $18 || $1b >= $1a);
                    if ($1d) {
                        var ep = new DayPilot.Event(e, $c);
                        ep.part.dayIndex = i;
                        ep.part.start = $18 < $1b ? e.start : $17;
                        ep.part.end = $1a > $1c ? e.end : $19;
                        var $1e = this.getPixels(ep.part.start, $0s.Start);
                        var $1f = this.getPixels(ep.part.end, $0s.Start);
                        var top = $1e.top;
                        var $1g = $1f.top;
                        if (top === $1g && ($1e.cut || $1f.cut)) {
                            continue;
                        };
                        var $1h = $1f.boxBottom;
                        ep.part.top = Math.floor(top / this.cellHeight) * this.cellHeight + 1;
                        ep.part.height = Math.max(Math.ceil($1h / this.cellHeight) * this.cellHeight - ep.part.top, this.cellHeight - 1) + 1;
                        ep.part.barTop = Math.max(top - ep.part.top - 1, 0);
                        ep.part.barHeight = Math.max($1g - top - 2, 1);
                        var $J = ep.part.top;
                        var end = ep.part.top + ep.part.height;
                        if ($J > scroll.maxStart) {
                            scroll.maxStart = $J;
                        };
                        if (end < scroll.minEnd) {
                            scroll.minEnd = end;
                        };
                        if ($J < this.minStart) {
                            this.minStart = $J;
                        };
                        if (end > this.maxEnd) {
                            this.maxEnd = end;
                        };
                        $0s.events.push(ep);
                        if (ep.part.start.getTime() === $1b && ep.part.end.getTime() === $1c) {
                            $16[j] = true;
                        }
                    }
                }
            };
            for (var i = 0; i < this.columns.length; i++) {
                var $0s = this.columns[i];
                $0s.events.sort(this.eventComparer);
                for (var j = 0; j < $0s.events.length; j++) {
                    var e = $0s.events[j];
                    $0s.putIntoBlock(e);
                };
                for (var j = 0; j < $0s.blocks.length; j++) {
                    var $00 = $0s.blocks[j];
                    $00.events.sort(this.eventComparer);
                    for (var k = 0; k < $00.events.length; k++) {
                        var e = $00.events[k];
                        $00.putIntoLine(e);
                    }
                }
            }
        };
        this.eventComparer = function(a, b) {
            if (!a || !b || !a.start || !b.start) {
                return 0;
            };
            var $1i = a.start().getTime() - b.start().getTime();
            if ($1i !== 0) {
                return $1i;
            };
            var $1j = b.end().getTime() - a.end().getTime();
            return $1j;
        };
        this.debug = function($10, $1k) {
            if (!this.debuggingEnabled) {
                return;
            };
            if (!$c.debugMessages) {
                $c.debugMessages = [];
            };
            $c.debugMessages.push($10);
            if (typeof console !== 'undefined') {
                console.log($10);
            }
        };
        this.getPixels = function($R, $J) {
            if (!$J) $J = this.startDate;
            var $1b = $J.getTime();
            var $1l = $R.getTime();
            var $1m = this.cache.pixels[$1l + "_" + $1b];
            if ($1m) {
                return $1m;
            };
            $1b = $J.getTime();
            var $1n = 30 * 60 * 1000;
            var $1o = $1l - $1b;
            var $1p = $1o % $1n;
            var $1q = $1o - $1p;
            var $1r = $1q + $1n;
            if ($1p === 0) {
                $1r = $1q;
            };
            var $t = {};
            $t.cut = false;
            $t.top = this.ticksToPixels($1o);
            $t.boxTop = this.ticksToPixels($1q);
            $t.boxBottom = this.ticksToPixels($1r);
            this.cache.pixels[$1l + "_" + $1b] = $t;
            return $t;
        };
        this.ticksToPixels = function($1l) {
            return Math.floor((this.cellHeight * $1l) / (1000 * 60 * 30));
        };
        this.prepareVariables = function() {
            this.startDate = new DayPilot.Date(this.startDate);
        };
        this.updateHeaderHeight = function() {
            if (this.nav.corner) {
                this.nav.corner.style.height = this.headerHeight + "px";
            }
        };
        this.updateHeight = function() {
            var sh = this.getScrollableHeight();
            if (this.nav.scroll && sh > 0) {
                this.nav.scroll.style.height = sh + "px";
            }
        };
        this.$1L = {};
        this.$1L.scope = null;
        this.$1L.notify = function() {
            if ($c.$1L.scope) {
                $c.$1L.scope["$apply"]();
            }
        };
        this.$1L.apply = function(f) {
            if ($c.angularAutoApply && $c.$1L.scope) {
                $c.$1L.scope["$apply"](f);
            } else {
                f();
            }
        };
        this.$1V = function() {
            if (this.backendUrl || typeof WebForm_DoCallback === 'function') {
                return (typeof $c.events.list === 'undefined') || (!$c.events.list);
            } else {
                return false;
            }
        };
        this.$1J = function() {
            if (this.nav.top.style.visibility === 'hidden') {
                this.nav.top.style.visibility = 'visible';
            }
        };
        this.show = function() {
            $c.visible = true;
            $c.nav.top.style.display = '';
        };
        this.hide = function() {
            $c.visible = false;
            $c.nav.top.style.display = 'none';
        };
        this.$1W = function() {
            this.prepareVariables();
            this.prepareColumns();
            this.drawTop();
            this.drawHeader();
            this.drawMain();
            this.fixScrollHeader();
            this.enableScrolling();
            this.registerGlobalHandlers();
            DayPilotCalendar.register(this);
            this.$1H('Init');
        };
        this.$1S = {};
        this.$1X = function() {
            this.$1S.themes = [];
            this.$1S.themes.push(this.theme || this.cssClassPrefix);
        };
        this.$1Y = function() {
            var $1s = this.$1S.themes;
            for (var i = 0; i < $1s.length; i++) {
                var $1t = $1s[i];
                DayPilot.Util.removeClass(this.nav.top, $1t + "_main");
            };
            this.$1S.themes = [];
        };
        this.$1Z = function() {
            this.afterRender(null, false);
            if (typeof this.onAfterRender === "function") {
                var $C = {};
                $C.isCallBack = false;
                this.onAfterRender($C);
            }
        };
        this.$20 = function() {
            if (typeof this.onInit === "function" && !this.$21) {
                this.$21 = true;
                var $C = {};
                this.onInit($C);
            }
        };
        this.$1T = function() {
            if (!$c.cssOnly) {
                $c.cssOnly = true;
                window.console && window.console.log && window.console.log("DayPilot: cssOnly = false mode is not supported anymore.");
            }
        };
        this.init = function() {
            this.$1U();
            var $1u = this.$1V();
            this.$1T();
            loadDefaultCss();
            this.$1X();
            if ($1u) {
                this.$1W();
                return;
            };
            this.prepareVariables();
            this.prepareColumns();
            this.loadEvents();
            this.drawTop();
            this.drawHeader();
            this.drawMain();
            this.$1J();
            this.fixScrollHeader();
            this.enableScrolling();
            this.registerGlobalHandlers();
            DayPilotCalendar.register(this);
            if (this.events) {
                this.updateHeaderHeight();
                this.drawEvents();
            };
            this.$1Z();
            this.$20();
            this.initialized = true;
        };
        this.Init = this.init;
    };
    DayPilotCalendar.Cell = function($J, end, $m) {
        this.start = $J;
        this.end = end;
        this.column = function() {};
    };
    DayPilotCalendar.Column = function($1v, name, $R) {
        this.value = $1v;
        this.name = name;
        this.date = new DayPilot.Date($R);
    };
    DayPilot.Calendar = DayPilotCalendar.Calendar;
    if (typeof jQuery !== 'undefined') {
        (function($) {
            $.fn.daypilotCalendar = function($1w) {
                var $1x = null;
                var j = this.each(function() {
                    if (this.daypilot) {
                        return;
                    };
                    var $1y = new DayPilot.Calendar(this.id);
                    this.daypilot = $1y;
                    for (name in $1w) {
                        $1y[name] = $1w[name];
                    };
                    $1y.init();
                    if (!$1x) {
                        $1x = $1y;
                    }
                });
                if (this.length === 1) {
                    return $1x;
                } else {
                    return j;
                }
            };
        })(jQuery);
    };
    (function registerAngularModule() {
        var $1z = DayPilot.am();
        if (!$1z) {
            return;
        };
        $1z.directive("daypilotCalendar", function() {
            return {
                "restrict": "E",
                "template": "<div></div>",
                "replace": true,
                "link": function($1A, element, $1B) {
                    var $c = new DayPilot.Calendar(element[0]);
                    $c.$1L.scope = $1A;
                    $c.init();
                    var $1C = $1B["id"];
                    if ($1C) {
                        $1A[$1C] = $c;
                    };
                    var $1D = $1A["$watch"];
                    $1D.call($1A, $1B["daypilotConfig"], function($1v) {
                        for (var name in $1v) {
                            $c[name] = $1v[name];
                        };
                        $c.update();
                        $c.$20();
                    }, true);
                    $1D.call($1A, $1B["daypilotEvents"], function($1v) {
                        $c.events.list = $1v;
                        $c.update();
                    }, true);
                }
            };
        });
    })();
})();


if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
(function() {
    if (typeof DayPilot.DatePicker !== 'undefined') {
        return;
    };
    DayPilot.DatePicker = function($a) {
        this.v = '192-lite';
        var $b = "navigator_" + new Date().getTime();
        var $c = this;
        this.prepare = function() {
            this.locale = "en-us";
            this.target = null;
            this.resetTarget = true;
            this.pattern = this.$m.locale().datePattern;
            this.cssClassPrefix = "navigator_white";
            this.theme = null;
            this.patterns = [];
            if ($a) {
                for (var name in $a) {
                    this[name] = $a[name];
                }
            };
            this.init();
        };
        this.init = function() {
            this.date = new DayPilot.Date(this.date);
            var $d = this.$n();
            if (this.resetTarget && !$d) {
                this.$o(this.date);
            };
            DayPilot.re(document, "mousedown", function() {
                $c.close();
            });
        };
        this.close = function() {
            if (!this.$p) {
                return;
            };
            if (this.navigator) {
                this.navigator.dispose();
            };
            this.div.innerHTML = '';
            if (this.div && this.div.parentNode === document.body) {
                document.body.removeChild(this.div);
            }
        };
        this.$n = function() {
            var element = this.$q();
            if (!element) {
                return this.date;
            };
            var $d = null;
            if (element.tagName === "INPUT") {
                $d = element.value;
            } else {
                $d = element.innerText;
            };
            if (!$d) {
                return null;
            };
            var $e = DayPilot.Date.parse($d, $c.pattern);
            for (var i = 0; i < $c.patterns.length; i++) {
                if ($e) {
                    return $e;
                };
                $e = DayPilot.Date.parse($d, $c.patterns[i]);
            };
            return $e;
        };
        this.$o = function($e) {
            var element = this.$q();
            if (!element) {
                return;
            };
            var $d = $e.toString($c.pattern, $c.locale);
            if (element.tagName === "INPUT") {
                element.value = $d;
            } else {
                element.innerHTML = $d;
            }
        };
        this.$m = {};
        this.$m.locale = function() {
            return DayPilot.Locale.find($c.locale);
        };
        this.$q = function() {
            var id = this.target;
            var element = (id && id.nodeType && id.nodeType === 1) ? id : document.getElementById(id);
            return element;
        };
        this.show = function() {
            var element = this.$q();
            var navigator = this.navigator;
            var navigator = new DayPilot.Navigator($b);
            navigator.api = 2;
            navigator.cssOnly = true;
            navigator.theme = $c.theme || $c.cssClassPrefix;
            navigator.weekStarts = "Auto";
            navigator.locale = $c.locale;
            navigator.timeRangeSelectedHandling = "JavaScript";
            navigator.onTimeRangeSelected = function($f) {
                $c.date = $f.start;
                var $g = $f.start;
                var $d = $g.toString($c.pattern, $c.locale);
                var $f = {};
                $f.start = $g;
                $f.date = $g;
                $f.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onTimeRangeSelect === 'function') {
                    $c.onTimeRangeSelect($f);
                    if ($f.preventDefault.value) {
                        return;
                    }
                };
                $c.$o($d);
                $c.close();
                if (typeof $c.onTimeRangeSelected === 'function') {
                    $c.onTimeRangeSelected($f);
                }
            };
            this.navigator = navigator;
            var $h = DayPilot.abs(element);
            var $i = element.offsetHeight;
            var $j = document.createElement("div");
            $j.style.position = "absolute";
            $j.style.left = $h.x + "px";
            $j.style.top = ($h.y + $i) + "px";
            var $k = document.createElement("div");
            $k.id = $b;
            $j.appendChild($k);
            DayPilot.re($j, "mousedown", function(ev) {
                var ev = ev || window.event;
                ev.cancelBubble = true;
                ev.stopPropagation && ev.stopPropagation();
            });
            document.body.appendChild($j);
            this.div = $j;
            var $l = $c.$n() || new DayPilot.Date().getDatePart();
            navigator.startDate = $l;
            navigator.selectionDay = $l;
            navigator.init();
            this.$p = true;
        };
        this.prepare();
    };
})();

if (typeof(DayPilot) === 'undefined') {
    DayPilot = {};
};
(function() {
    DayPilot.ModalStatic = {};
    DayPilot.ModalStatic.list = [];
    DayPilot.ModalStatic.hide = function() {
        if (this.list.length > 0) {
            var $a = this.list.pop();
            if ($a) {
                $a.hide();
            }
        }
    };
    DayPilot.ModalStatic.remove = function($b) {
        var $c = DayPilot.ModalStatic.list;
        for (var i = 0; i < $c.length; i++) {
            if ($c[i] === $b) {
                $c.splice(i, 1);
                return;
            }
        }
    };
    DayPilot.ModalStatic.close = function($d) {
        DayPilot.ModalStatic.result($d);
        DayPilot.ModalStatic.hide();
    };
    DayPilot.ModalStatic.result = function(r) {
        var $c = DayPilot.ModalStatic.list;
        if ($c.length > 0) {
            $c[$c.length - 1].result = r;
        }
    };
    DayPilot.ModalStatic.displayed = function($b) {
        var $c = DayPilot.ModalStatic.list;
        for (var i = 0; i < $c.length; i++) {
            if ($c[i] === $b) {
                return true;
            }
        };
        return false;
    };
    var $e = (navigator && navigator.userAgent && navigator.userAgent.indexOf("MSIE") !== -1);
    DayPilot.Modal = function($f) {
        this.autoStretch = true;
        this.autoStretchFirstLoadOnly = false;
        this.border = "10px solid #ccc";
        this.corners = 'Rounded';
        this.className = null;
        this.dragDrop = true;
        this.height = 200;
        this.maxHeight = null;
        this.opacity = 30;
        this.scrollWithPage = true;
        this.top = 20;
        this.useIframe = true;
        this.width = 500;
        this.zIndex = null;
        this.closed = null;
        this.onClosed = null;
        var $g = this;
        this.id = '_' + new Date().getTime() + 'n' + (Math.random() * 10);
        this.registered = false;
        this.start = null;
        this.coords = null;
        this.showHtml = function($h) {
            if (DayPilot.ModalStatic.displayed(this)) {
                throw "This modal dialog is already displayed.";
            };
            if (!this.div) {
                this.create();
            };
            this.update();
            if (this.useIframe) {
                var $i = function(p, $j) {
                    return function() {
                        p.setInnerHTML(p.id + "iframe", $j);
                    };
                };
                window.setTimeout($i(this, $h), 0);
            } else {
                this.div.innerHTML = $h;
            };
            this.update();
            this.register();
        };
        this.rounded = function() {
            return this.corners && this.corners.toLowerCase() === 'rounded';
        };
        this.showUrl = function($k) {
            if (DayPilot.ModalStatic.displayed(this)) {
                throw "This modal dialog is already displayed.";
            };
            this.useIframe = true;
            if (!this.div) {
                this.create();
            };
            this.re(this.iframe, "load", this.onIframeLoad);
            this.iframe.src = $k;
            this.update();
            this.register();
        };
        this.update = function() {
            var $l = window;
            var $m = document;
            var scrollY = $l.pageYOffset ? $l.pageYOffset : (($m.documentElement && $m.documentElement.scrollTop) ? $m.documentElement.scrollTop : $m.body.scrollTop);
            var $n = function() {
                return $g.windowRect().y;
            };
            this.hideDiv.style.filter = "alpha(opacity=" + this.opacity + ")";
            this.hideDiv.style.opacity = "0." + this.opacity;
            this.hideDiv.style.backgroundColor = "black";
            if (this.zIndex) {
                this.hideDiv.style.zIndex = this.zIndex;
            };
            this.hideDiv.style.display = '';
            window.setTimeout(function() {
                $g.hideDiv.onclick = function() {
                    $g.hide();
                };
            }, 500);
            this.div.className = this.className;
            this.div.style.border = this.border;
            if (this.rounded()) {
                this.div.style.MozBorderRadius = "5px";
                this.div.style.webkitBorderRadius = "5px";
                this.div.style.borderRadius = "5px";
            };
            this.div.style.marginLeft = '-' + Math.floor(this.width / 2) + "px";
            this.div.style.position = 'absolute';
            this.div.style.top = (scrollY + this.top) + 'px';
            this.div.style.width = this.width + 'px';
            if (this.zIndex) {
                this.div.style.zIndex = this.zIndex;
            };
            if (this.height) {
                this.div.style.height = this.height + 'px';
            };
            if (this.useIframe && this.height) {
                this.iframe.style.height = (this.height) + 'px';
            };
            this.div.style.display = '';
            DayPilot.ModalStatic.list.push(this);
        };
        this.onIframeLoad = function() {
            $g.iframe.contentWindow.modal = $g;
            if ($g.autoStretch) {
                $g.stretch();
            }
        };
        this.stretch = function() {
            var $n = function() {
                return $g.windowRect().y;
            };
            var $o = function() {
                return $g.windowRect().x;
            };
            var $p = $o() - 40;
            for (var w = this.width; w < $p && this.hasHorizontalScrollbar(); w += 10) {
                this.div.style.width = w + 'px';
                this.div.style.marginLeft = '-' + Math.floor(w / 2) + "px";
            };
            var $q = this.maxHeight || $n() - 2 * this.top;
            for (var h = this.height; h < $q && this.hasVerticalScrollbar(); h += 10) {
                this.iframe.style.height = (h) + 'px';
                this.div.style.height = h + 'px';
            };
            if (this.autoStretchFirstLoadOnly) {
                this.ue(this.iframe, "load", this.onIframeLoad);
            }
        };
        this.hasHorizontalScrollbar = function() {
            var document = this.iframe.contentWindow.document;
            var $r = document.compatMode === 'BackCompat' ? document.body : document.documentElement;
            var $s = $r.scrollWidth;
            var $t = document.body.children;
            for (var i = 0; i < $t.length; i++) {
                var $u = $t[i].offsetLeft + $t[i].offsetWidth;
                $s = Math.max($s, $u);
            };
            var $v = $s > $r.clientWidth;
            return $v;
        };
        this.hasVerticalScrollbar = function() {
            var document = this.iframe.contentWindow.document;
            var $r = document.compatMode === 'BackCompat' ? document.body : document.documentElement;
            var $w = $r.scrollHeight;
            var $t = document.body.children;
            for (var i = 0; i < $t.length; i++) {
                var $u = $t[i].offsetTop + $t[i].offsetHeight;
                $w = Math.max($w, $u);
            };
            var $x = $w > $r.clientHeight;
            return $x;
        };
        this.windowRect = function() {
            var $m = document;
            if ($m.compatMode === "CSS1Compat" && $m.documentElement && $m.documentElement.clientWidth) {
                var x = $m.documentElement.clientWidth;
                var y = $m.documentElement.clientHeight;
                return {
                    x: x,
                    y: y
                };
            } else {
                var x = $m.body.clientWidth;
                var y = $m.body.clientHeight;
                return {
                    x: x,
                    y: y
                };
            }
        };
        this.register = function() {
            if (this.registered) {
                return;
            };
            this.re(window, 'resize', this.resize);
            this.re(window, 'scroll', this.resize);
            if (this.dragDrop) {
                this.re(document, 'mousemove', this.drag);
                this.re(document, 'mouseup', this.drop);
            };
            this.registered = true;
        };
        this.drag = function(e) {
            if (!$g.coords) {
                return;
            };
            var e = e || window.event;
            var $y = $g.mc(e);
            var x = $y.x - $g.coords.x;
            var y = $y.y - $g.coords.y;
            $g.div.style.marginLeft = '0px';
            $g.div.style.top = ($g.start.y + y) + "px";
            $g.div.style.left = ($g.start.x + x) + "px";
        };
        this.drop = function(e) {
            if (!$g.coords) {
                return;
            };
            $g.unmaskIframe();
            $g.coords = null;
        };
        this.maskIframe = function() {
            if (!this.useIframe) {
                return;
            };
            var $z = 80;
            var $A = document.createElement("div");
            $A.style.backgroundColor = "#ffffff";
            $A.style.filter = "alpha(opacity=" + $z + ")";
            $A.style.opacity = "0." + $z;
            $A.style.width = "100%";
            $A.style.height = this.height + "px";
            $A.style.position = "absolute";
            $A.style.left = '0px';
            $A.style.top = '0px';
            this.div.appendChild($A);
            this.mask = $A;
        };
        this.unmaskIframe = function() {
            if (!this.useIframe) {
                return;
            };
            this.div.removeChild(this.mask);
            this.mask = null;
        };
        this.resize = function() {
            if (!$g.hideDiv) {
                return;
            };
            if (!$g.div) {
                return;
            };
            if ($g.hideDiv.style.display === 'none') {
                return;
            };
            if ($g.div.style.display === 'none') {
                return;
            };
            var scrollY = window.pageYOffset ? window.pageYOffset : ((document.documentElement && document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop);
            if (!$g.scrollWithPage) {
                $g.div.style.top = (scrollY + $g.top) + 'px';
            }
        };
        this.re = function(el, ev, $B) {
            if (el.addEventListener) {
                el.addEventListener(ev, $B, false);
            } else if (el.attachEvent) {
                el.attachEvent("on" + ev, $B);
            }
        };
        this.ue = function(el, ev, $B) {
            if (el.removeEventListener) {
                el.removeEventListener(ev, $B, false);
            } else if (el.detachEvent) {
                el.detachEvent("on" + ev, $B);
            }
        };
        this.mc = function(ev) {
            if (ev.pageX || ev.pageY) {
                return {
                    x: ev.pageX,
                    y: ev.pageY
                };
            };
            return {
                x: ev.clientX + document.documentElement.scrollLeft,
                y: ev.clientY + document.documentElement.scrollTop
            };
        };
        this.abs = function(element) {
            var r = {
                x: element.offsetLeft,
                y: element.offsetTop
            };
            while (element.offsetParent) {
                element = element.offsetParent;
                r.x += element.offsetLeft;
                r.y += element.offsetTop;
            };
            return r;
        };
        this.create = function() {
            var $C = document.createElement("div");
            $C.id = this.id + "hide";
            $C.style.position = 'fixed';
            $C.style.left = "0px";
            $C.style.top = "0px";
            $C.style.right = "0px";
            $C.style.bottom = "0px";
            $C.style.backgroundColor = "black";
            $C.style.opacity = 0.50;
            $C.oncontextmenu = function() {
                return false;
            };
            document.body.appendChild($C);
            var $D = document.createElement("div");
            $D.id = this.id + 'popup';
            $D.style.position = 'fixed';
            $D.style.left = '50%';
            $D.style.top = '0px';
            $D.style.backgroundColor = 'white';
            $D.style.width = "50px";
            $D.style.height = "50px";
            if (this.dragDrop) {
                $D.onmousedown = this.dragStart;
            };
            var $E = 50;
            var $F = null;
            if (this.useIframe) {
                $F = document.createElement("iframe");
                $F.id = this.id + "iframe";
                $F.name = this.id + "iframe";
                $F.frameBorder = '0';
                $F.style.width = '100%';
                $F.style.height = $E + 'px';
                $D.appendChild($F);
            };
            document.body.appendChild($D);
            this.div = $D;
            this.iframe = $F;
            this.hideDiv = $C;
        };
        this.dragStart = function(e) {
            $g.maskIframe();
            $g.coords = $g.mc(e || window.event);
            $g.start = {
                x: $g.div.offsetLeft,
                y: $g.div.offsetTop
            };
        };
        this.setInnerHTML = function(id, $j) {
            var $G = window.frames[id];
            var $m = $G.contentWindow || $G.document || $G.contentDocument;
            if ($m.document) {
                $m = $m.document;
            };
            $m.body.innerHTML = $j;
        };
        this.close = function($d) {
            this.result = $d;
            this.hide();
        };
        this.hide = function() {
            if (this.div) {
                this.div.style.display = 'none';
                this.hideDiv.style.display = 'none';
                if (!this.useIframe) {
                    this.div.innerHTML = null;
                }
            };
            DayPilot.ModalStatic.remove(this);
            if (this.onClosed) {
                var $H = {};
                $H.result = this.result;
                this.onClosed($H);
            } else if (this.closed) {
                this.closed();
            }
        };
        this.$I = function() {
            if (!$f) {
                return;
            };
            for (var name in $f) {
                this[name] = $f[name];
            }
        };
        this.$I();
    };
    DayPilot.Modal.close = function($d) {
        if (parent && parent.DayPilot && parent.DayPilot.ModalStatic) {
            parent.DayPilot.ModalStatic.close($d);
        } else {
            throw "Unable to close DayPilot.Modal dialog.";
        }
    };
})();


if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilot.Global === 'undefined') {
    DayPilot.Global = {};
};
(function() {
    var $a = function() {};
    if (typeof DayPilot.Month !== 'undefined') {
        return;
    };

    function loadDefaultCss() {
        if (DayPilot.Global.defaultMonthCss) {
            return;
        };
        var $b = DayPilot.sheet();
        $b.add(".month_default_main", "border: 1px solid #aaa;font-family: Tahoma, Arial, sans-serif; font-size: 12px;color: #666;");
        $b.add(".month_default_main *, .month_default_main *:before, .month_default_main *:after", "box-sizing: content-box;");
        $b.add(".month_default_cell_inner", "border-right: 1px solid #ddd;border-bottom: 1px solid #ddd;position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;background-color: #f9f9f9;");
        $b.add(".month_default_cell_business .month_default_cell_inner", "background-color: #fff;");
        $b.add(".month_default_cell_header", "text-align: right;padding-right: 2px;");
        $b.add(".month_default_header_inner", 'text-align: center; vertical-align: middle;position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #999;border-bottom: 1px solid #999;cursor: default;color: #666;background: #eee;');
        $b.add(".month_default_message", 'padding: 10px;opacity: 0.9;filter: alpha(opacity=90);color: #ffffff;background: #ffa216;background: -webkit-gradient(linear, left top, left bottom, from(#ffa216), to(#ff8400));background: -webkit-linear-gradient(top, #ffa216 0%, #ff8400);background: -moz-linear-gradient(top, #ffa216 0%, #ff8400);background: -ms-linear-gradient(top, #ffa216 0%, #ff8400);background: -o-linear-gradient(top, #ffa216 0%, #ff8400);background: linear-gradient(top, #ffa216 0%, #ff8400);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffa216", endColorStr="#ff8400");');
        $b.add(".month_default_event_inner", 'position: absolute;top: 0px;bottom: 0px;left: 1px;right: 1px;overflow:hidden;padding: 2px;padding-left: 5px;font-size: 12px;color: #666;background: #fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");border: 1px solid #999;border-radius: 0px;');
        $b.add(".month_default_event_continueright .month_default_event_inner", "border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-right-style: dotted;");
        $b.add(".month_default_event_continueleft .month_default_event_inner", "border-top-left-radius: 0px;border-bottom-left-radius: 0px;border-left-style: dotted;");
        $b.add(".month_default_event_hover .month_default_event_inner", 'background: #fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#e8e8e8));background: -webkit-linear-gradient(top, #ffffff 0%, #e8e8e8);background: -moz-linear-gradient(top, #ffffff 0%, #e8e8e8);background: -ms-linear-gradient(top, #ffffff 0%, #e8e8e8);background: -o-linear-gradient(top, #ffffff 0%, #e8e8e8);background: linear-gradient(top, #ffffff 0%, #e8e8e8);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#e8e8e8");');
        $b.add(".month_default_selected .month_default_event_inner, .month_default_event_hover.month_default_selected .month_default_event_inner", "background: #ddd;");
        $b.add(".month_default_shadow_inner", "background-color: #666666;opacity: 0.5;filter: alpha(opacity=50);height: 100%;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;");
        $b.commit();
        DayPilot.Global.defaultMonthCss = true;
    };
    var DayPilotMonth = {};
    DayPilotMonth.Month = function($c) {
        this.v = '192-lite';
        this.nav = {};
        var $d = this;
        this.id = $c;
        this.isMonth = true;
        this.hideUntilInit = true;
        this.angularAutoApply = true;
        this.api = 2;
        this.cssOnly = true;
        this.cssClassPrefix = "month_default";
        this.theme = null;
        this.startDate = new DayPilot.Date();
        this.width = '100%';
        this.cellHeight = 100;
        this.eventFontColor = "#000000";
        this.eventFontFamily = "Tahoma";
        this.eventFontSize = "11px";
        this.headerBackColor = '#F3F3F9';
        this.headerFontColor = '#42658C';
        this.headerFontFamily = "Tahoma";
        this.headerFontSize = "10pt";
        this.headerHeight = 20;
        this.weekStarts = 1;
        this.innerBorderColor = '#cccccc';
        this.borderColor = '#CED2CE';
        this.eventHeight = 25;
        this.cellHeaderHeight = 16;
        this.afterRender = function() {};
        this.backColor = '#ffffff';
        this.nonBusinessBackColor = '#ffffff';
        this.cellHeaderBackColor = '#ffffff';
        this.cellHeaderFontColor = '#42658C';
        this.cellHeaderFontFamily = 'Tahoma';
        this.cellHeaderFontSize = '10pt';
        this.eventBackColor = '#2951A5';
        this.eventBorderColor = '#2951A5';
        this.eventFontColor = '#ffffff';
        this.eventFontFamily = 'Tahoma';
        this.eventFontSize = '11px';
        this.cellWidth = 14.285;
        this.lineSpace = 1;
        this.eventClickHandling = 'Enabled';
        this.eventMoveHandling = 'Update';
        this.eventResizeHandling = 'Update';
        this.timeRangeSelectedHandling = 'Enabled';
        this.onEventClick = null;
        this.onEventClicked = null;
        this.onEventMove = null;
        this.onEventMoved = null;
        this.onEventResize = null;
        this.onEventResized = null;
        this.onTimeRangeSelect = null;
        this.onTimeRangeSelected = null;
        this.backendUrl = null;
        this.cellEvents = [];
        this.elements = {};
        this.elements.events = [];
        this.cache = {};
        this.updateView = function($e, $f) {
            var $e = eval("(" + $e + ")");
            if ($e.CallBackRedirect) {
                document.location.href = $e.CallBackRedirect;
                return;
            };
            if ($e.UpdateType === "None") {
                $d.fireAfterRenderDetached($e.CallBackData, true);
                return;
            };
            $d.events.list = $e.Events;
            if ($e.UpdateType === "Full") {
                $d.startDate = $e.StartDate;
                $d.headerBackColor = $e.HeaderBackColor ? $e.HeaderBackColor : $d.headerBackColor;
                $d.backColor = $e.BackColor ? $e.BackColor : $d.backColor;
                $d.nonBusinessBackColor = $e.NonBusinessBackColor ? $e.NonBusinessBackColor : $d.nonBusinessBackColor;
                $d.timeFormat = $e.TimeFormat ? $e.TimeFormat : $d.timeFormat;
                if (typeof $e.WeekStarts !== 'undefined') {
                    $d.weekStarts = $e.WeekStarts;
                };
                $d.hashes = $e.Hashes;
            };
            $d.$0V();
            $d.$0W();
            $d.$0X();
            if ($e.UpdateType === "Full") {
                $d.$0Y();
                $d.$0Z();
            };
            $d.updateHeight();
            $d.show();
            $d.$10();
            $d.fireAfterRenderDetached($e.CallBackData, true);
        };
        this.fireAfterRenderDetached = function($g, $h) {
            var $i = function($g, $j) {
                return function() {
                    if ($d.afterRender) {
                        $d.afterRender($g, $j);
                    }
                };
            };
            window.setTimeout($i($g, $h), 0);
        };
        this.lineHeight = function() {
            return this.eventHeight + this.lineSpace;
        };
        this.events = {};
        this.events.add = function(e) {
            e.calendar = $d;
            if (!$d.events.list) {
                $d.events.list = [];
            };
            $d.events.list.push(e.data);
            $d.update();
            $d.$11.notify();
        };
        this.events.update = function(e) {
            e.commit();
            $d.update();
            $d.$11.notify();
        };
        this.events.remove = function(e) {
            var $k = DayPilot.indexOf($d.events.list, e.data);
            $d.events.list.splice($k, 1);
            $d.update();
            $d.$11.notify();
        };
        this.update = function() {
            if (!this.cells) {
                return;
            };
            var $l = true;
            this.$12();
            $d.$0V();
            $d.$0W();
            $d.$0X();
            if ($l) {
                $d.$0Y();
                $d.$0Z();
            };
            $d.updateHeight();
            $d.show();
            $d.$10();
        };
        this.$0X = function() {
            var $m = this.events.list;
            if (!$m) {
                return;
            };
            for (var x = 0; x < $m.length; x++) {
                var $g = $m[x];
                $g.start = new DayPilot.Date($g.start);
                $g.end = new DayPilot.Date($g.end);
                if ($g.start.getTime() > $g.end.getTime()) {
                    continue;
                };
                for (var i = 0; i < this.rows.length; i++) {
                    var $n = this.rows[i];
                    var ev = new DayPilot.Event($g, this);
                    if ($n.belongsHere(ev)) {
                        $n.events.push(ev);
                    }
                }
            };
            for (var ri = 0; ri < this.rows.length; ri++) {
                var $n = this.rows[ri];
                $n.events.sort(this.eventComparer);
                for (var ei = 0; ei < this.rows[ri].events.length; ei++) {
                    var ev = $n.events[ei];
                    var $o = $n.getStartColumn(ev);
                    var $p = $n.getWidth(ev);
                    var $q = $n.putIntoLine(ev, $o, $p, ri);
                }
            }
        };
        this.$0V = function() {
            for (var i = 0; i < this.elements.events.length; i++) {
                var e = this.elements.events[i];
                e.event = null;
                e.click = null;
                e.parentNode.removeChild(e);
            };
            this.elements.events = [];
        };
        this.$10 = function() {
            this.$13();
        };
        this.$13 = function() {
            this.elements.events = [];
            for (var ri = 0; ri < this.rows.length; ri++) {
                var $n = this.rows[ri];
                for (var li = 0; li < $n.lines.length; li++) {
                    var $q = $n.lines[li];
                    for (var pi = 0; pi < $q.length; pi++) {
                        this.$14($q[pi]);
                    }
                }
            }
        };
        this.eventComparer = function(a, b) {
            if (!a || !b || !a.start || !b.start) {
                return 0;
            };
            var $r = a.start().getTime() - b.start().getTime();
            if ($r !== 0) {
                return $r;
            };
            var $s = b.end().getTime() - a.end().getTime();
            return $s;
        };
        this.drawShadow = function(x, y, $q, $t, $u, e) {
            if (!$u) {
                $u = 0;
            };
            var $v = $t;
            this.shadow = {};
            this.shadow.list = [];
            this.shadow.start = {
                x: x,
                y: y
            };
            this.shadow.width = $t;
            var $w = y * 7 + x - $u;
            if ($w < 0) {
                $v += $w;
                x = 0;
                y = 0;
            };
            var $x = $u;
            while ($x >= 7) {
                y--;
                $x -= 7;
            };
            if ($x > x) {
                var $y = 7 - this.getColCount();
                if ($x > (x + $y)) {
                    y--;
                    x = x + 7 - $x;
                } else {
                    $v = $v - $x + x;
                    x = 0;
                }
            } else {
                x -= $x;
            };
            if (y < 0) {
                y = 0;
                x = 0;
            };
            var $z = null;
            if (DayPilotMonth.resizingEvent) {
                $z = 'w-resize';
            } else if (DayPilotMonth.movingEvent) {
                $z = "move";
            };
            this.nav.top.style.cursor = $z;
            while ($v > 0 && y < this.rows.length) {
                var $A = Math.min(this.getColCount() - x, $v);
                var $n = this.rows[y];
                var top = this.getRowTop(y);
                var $B = $n.getHeight();
                var $C = document.createElement("div");
                $C.setAttribute("unselectable", "on");
                $C.style.position = 'absolute';
                $C.style.left = (this.getCellWidth() * x) + '%';
                $C.style.width = (this.getCellWidth() * $A) + '%';
                $C.style.top = (top) + 'px';
                $C.style.height = ($B) + 'px';
                $C.style.cursor = $z;
                var $D = document.createElement("div");
                $D.setAttribute("unselectable", "on");
                $C.appendChild($D);
                $D.style.position = "absolute";
                $D.style.top = "0px";
                $D.style.right = "0px";
                $D.style.left = "0px";
                $D.style.bottom = "0px";
                $D.style.backgroundColor = "#aaaaaa";
                $D.style.opacity = 0.5;
                $D.style.filter = "alpha(opacity=50)";
                this.nav.top.appendChild($C);
                this.shadow.list.push($C);
                $v -= ($A + 7 - this.getColCount());
                x = 0;
                y++;
            }
        };
        this.clearShadow = function() {
            if (this.shadow) {
                for (var i = 0; i < this.shadow.list.length; i++) {
                    this.nav.top.removeChild(this.shadow.list[i]);
                };
                this.shadow = null;
                this.nav.top.style.cursor = '';
            }
        };
        this.getEventTop = function($n, $q) {
            var top = this.headerHeight;
            for (var i = 0; i < $n; i++) {
                top += this.rows[i].getHeight();
            };
            top += this.cellHeaderHeight;
            top += $q * this.lineHeight();
            return top;
        };
        this.getDateFromCell = function(x, y) {
            return this.firstDate.addDays(y * 7 + x);
        };
        this.$14 = function(e) {
            var $n = e.part.row;
            var $q = e.part.line;
            var $o = e.part.colStart;
            var $p = e.part.colWidth;
            var $E = this.getCellWidth() * ($o);
            var $t = this.getCellWidth() * ($p);
            var top = this.getEventTop($n, $q);
            var $F = document.createElement("div");
            $F.setAttribute("unselectable", "on");
            $F.style.height = this.eventHeight + 'px';
            $F.className = this.$15("_event");
            if (e.data.cssClass) {
                DayPilot.Util.addClass($F, e.data.cssClass);
            };
            $F.event = e;
            $F.style.width = $t + '%';
            $F.style.position = 'absolute';
            $F.style.left = $E + '%';
            $F.style.top = top + 'px';
            if (this.showToolTip && e.client.toolTip()) {
                $F.title = e.client.toolTip();
            };
            $F.onclick = $d.eventClickDispatch;
            $F.onmousedown = function(ev) {
                ev = ev || window.event;
                var $G = ev.which || ev.button;
                ev.cancelBubble = true;
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                };
                if ($G === 1) {
                    DayPilotMonth.movingEvent = null;
                    if (this.style.cursor === 'w-resize' || this.style.cursor === 'e-resize') {
                        var $H = {};
                        $H.start = {};
                        $H.start.x = $o;
                        $H.start.y = $n;
                        $H.event = $F.event;
                        $H.width = DayPilot.DateUtil.daysSpan($H.event.start(), $H.event.end()) + 1;
                        $H.direction = this.style.cursor;
                        DayPilotMonth.resizingEvent = $H;
                    } else if (this.style.cursor === 'move' || $d.eventMoveHandling !== 'Disabled') {
                        $d.clearShadow();
                        var $I = DayPilot.mo2($d.nav.top, ev);
                        if (!$I) {
                            return;
                        };
                        var $J = $d.getCellBelowPoint($I.x, $I.y);
                        var $w = DayPilot.DateUtil.daysDiff(e.start(), $d.rows[$n].start);
                        var $u = ($J.y * 7 + $J.x) - ($n * 7 + $o);
                        if ($w) {
                            $u += $w;
                        };
                        var $K = {};
                        $K.start = {};
                        $K.start.x = $o;
                        $K.start.y = $n;
                        $K.start.line = $q;
                        $K.offset = $d.eventMoveToPosition ? 0 : $u;
                        $K.colWidth = $p;
                        $K.event = $F.event;
                        $K.coords = $I;
                        DayPilotMonth.movingEvent = $K;
                    }
                }
            };
            $F.onmousemove = function(ev) {
                if (typeof(DayPilotMonth) === 'undefined') {
                    return;
                };
                if (DayPilotMonth.movingEvent || DayPilotMonth.resizingEvent) {
                    return;
                };
                var $u = DayPilot.mo3($F, ev);
                if (!$u) {
                    return;
                };
                var $L = 6;
                if ($u.x <= $L && $d.eventResizeHandling !== 'Disabled') {
                    if (e.part.startsHere) {
                        $F.style.cursor = "w-resize";
                        $F.dpBorder = 'left';
                    } else {
                        $F.style.cursor = 'not-allowed';
                    }
                } else if ($F.clientWidth - $u.x <= $L && $d.eventResizeHandling !== 'Disabled') {
                    if (e.part.endsHere) {
                        $F.style.cursor = "e-resize";
                        $F.dpBorder = 'right';
                    } else {
                        $F.style.cursor = 'not-allowed';
                    }
                } else {
                    $F.style.cursor = 'default';
                }
            };
            $F.onmouseout = function(ev) {
                $F.style.cursor = '';
            };
            var $M = document.createElement("div");
            $M.setAttribute("unselectable", "on");
            $M.className = this.$15("_event_inner");
            if (e.data.backColor) {
                $M.style.background = e.data.backColor;
                if (DayPilot.browser.ie9 || DayPilot.browser.ielt9) {
                    $M.style.filter = '';
                }
            };
            $M.innerHTML = e.client.html();
            $F.appendChild($M);
            this.elements.events.push($F);
            this.nav.events.appendChild($F);
        };
        this.lastVisibleDayOfMonth = function() {
            return this.startDate.lastDayOfMonth();
        };
        this.$0W = function() {
            if (typeof this.startDate === 'string') {
                this.startDate = new DayPilot.Date(this.startDate);
            };
            this.startDate = this.startDate.firstDayOfMonth();
            this.firstDate = this.startDate.firstDayOfWeek(this.getWeekStart());
            var $N = this.startDate;
            var $O;
            var $P = this.lastVisibleDayOfMonth();
            var $Q = DayPilot.DateUtil.daysDiff(this.firstDate, $P) + 1;
            $O = Math.ceil($Q / 7);
            this.days = $O * 7;
            this.rows = [];
            for (var x = 0; x < $O; x++) {
                var r = {};
                r.start = this.firstDate.addDays(x * 7);
                r.end = r.start.addDays(this.getColCount());
                r.events = [];
                r.lines = [];
                r.index = x;
                r.minHeight = this.cellHeight;
                r.calendar = this;
                r.belongsHere = function(ev) {
                    if (ev.end().getTime() === ev.start().getTime() && ev.start().getTime() === this.start.getTime()) {
                        return true;
                    };
                    return !(ev.end().getTime() <= this.start.getTime() || ev.start().getTime() >= this.end.getTime());
                };
                r.getPartStart = function(ev) {
                    return DayPilot.DateUtil.max(this.start, ev.start());
                };
                r.getPartEnd = function(ev) {
                    return DayPilot.DateUtil.min(this.end, ev.end());
                };
                r.getStartColumn = function(ev) {
                    var $R = this.getPartStart(ev);
                    return DayPilot.DateUtil.daysDiff(this.start, $R);
                };
                r.getWidth = function(ev) {
                    return DayPilot.DateUtil.daysSpan(this.getPartStart(ev), this.getPartEnd(ev)) + 1;
                };
                r.putIntoLine = function(ev, $o, $p, $n) {
                    var $S = this;
                    for (var i = 0; i < this.lines.length; i++) {
                        var $q = this.lines[i];
                        if ($q.isFree($o, $p)) {
                            $q.addEvent(ev, $o, $p, $n, i);
                            return i;
                        }
                    };
                    var $q = [];
                    $q.isFree = function($o, $p) {
                        var $T = true;
                        for (var i = 0; i < this.length; i++) {
                            if (!($o + $p - 1 < this[i].part.colStart || $o > this[i].part.colStart + this[i].part.colWidth - 1)) {
                                $T = false;
                            }
                        };
                        return $T;
                    };
                    $q.addEvent = function(ep, $o, $p, $n, $k) {
                        ep.part.colStart = $o;
                        ep.part.colWidth = $p;
                        ep.part.row = $n;
                        ep.part.line = $k;
                        ep.part.startsHere = $S.start.getTime() <= ep.start().getTime();
                        ep.part.endsHere = $S.end.getTime() >= ep.end().getTime();
                        this.push(ep);
                    };
                    $q.addEvent(ev, $o, $p, $n, this.lines.length);
                    this.lines.push($q);
                    return this.lines.length - 1;
                };
                r.getStart = function() {
                    var $U = 0;
                    for (var i = 0; i < $d.rows.length && i < this.index; i++) {
                        $U += $d.rows[i].getHeight();
                    }
                };
                r.getHeight = function() {
                    return Math.max(this.lines.length * $d.lineHeight() + $d.cellHeaderHeight, this.calendar.cellHeight);
                };
                this.rows.push(r);
            };
            this.endDate = this.firstDate.addDays($O * 7);
        };
        this.getHeight = function() {
            var $B = this.headerHeight;
            for (var i = 0; i < this.rows.length; i++) {
                $B += this.rows[i].getHeight();
            };
            return $B;
        };
        this.getWidth = function($U, end) {
            var $V = (end.y * 7 + end.x) - ($U.y * 7 + $U.x);
            return $V + 1;
        };
        this.getMinCoords = function($W, $X) {
            if (($W.y * 7 + $W.x) < ($X.y * 7 + $X.x)) {
                return $W;
            } else {
                return $X;
            }
        };
        this.$15 = function($Y) {
            var $Z = this.theme || this.cssClassPrefix;
            if ($Z) {
                return $Z + $Y;
            } else {
                return "";
            }
        };
        this.drawTop = function() {
            var $00 = this.nav.top;
            $00.setAttribute("unselectable", "on");
            $00.style.MozUserSelect = 'none';
            $00.style.KhtmlUserSelect = 'none';
            $00.style.WebkitUserSelect = 'none';
            $00.style.position = 'relative';
            if (this.width) {
                $00.style.width = this.width;
            };
            $00.style.height = this.getHeight() + 'px';
            $00.onselectstart = function(e) {
                return false;
            };
            if (this.hideUntilInit) {
                $00.style.visibility = 'hidden';
            };
            if (this.cssOnly) {
                $00.className = this.$15("_main");
            } else {
                $00.style.border = "1px solid " + this.borderColor;
            };
            var $01 = document.createElement("div");
            this.nav.cells = $01;
            $01.style.position = "absolute";
            $01.style.left = "0px";
            $01.style.right = "0px";
            $01.setAttribute("unselectable", "on");
            $00.appendChild($01);
            var $m = document.createElement("div");
            this.nav.events = $m;
            $m.style.position = "absolute";
            $m.style.left = "0px";
            $m.style.right = "0px";
            $m.setAttribute("unselectable", "on");
            $00.appendChild($m);
            $00.onmousemove = function(ev) {
                if (DayPilotMonth.resizingEvent) {
                    var $I = DayPilot.mo2($d.nav.top, ev);
                    if (!$I) {
                        return;
                    };
                    var $J = $d.getCellBelowPoint($I.x, $I.y);
                    $d.clearShadow();
                    var $H = DayPilotMonth.resizingEvent;
                    var $02 = $H.start;
                    var $t, $U;
                    if ($H.direction === 'w-resize') {
                        $U = $J;
                        var $03 = $H.event.end();
                        if ($03.getDatePart() === $03) {
                            $03 = $03.addDays(-1);
                        };
                        var end = $d.getCellFromDate($03);
                        $t = $d.getWidth($J, end);
                    } else {
                        $U = $d.getCellFromDate($H.event.start());
                        $t = $d.getWidth($U, $J);
                    };
                    if ($t < 1) {
                        $t = 1;
                    };
                    $d.drawShadow($U.x, $U.y, 0, $t);
                } else if (DayPilotMonth.movingEvent) {
                    var $I = DayPilot.mo2($d.nav.top, ev);
                    if (!$I) {
                        return;
                    };
                    if ($I.x === DayPilotMonth.movingEvent.coords.x && $I.y === DayPilotMonth.movingEvent.coords.y) {
                        return;
                    };
                    var $J = $d.getCellBelowPoint($I.x, $I.y);
                    $d.clearShadow();
                    var event = DayPilotMonth.movingEvent.event;
                    var $u = DayPilotMonth.movingEvent.offset;
                    var $t = $d.cellMode ? 1 : DayPilot.DateUtil.daysSpan(event.start(), event.end()) + 1;
                    if ($t < 1) {
                        $t = 1;
                    };
                    $d.drawShadow($J.x, $J.y, 0, $t, $u, event);
                } else if (DayPilotMonth.timeRangeSelecting) {
                    var $I = DayPilot.mo2($d.nav.top, ev);
                    if (!$I) {
                        return;
                    };
                    var $J = $d.getCellBelowPoint($I.x, $I.y);
                    $d.clearShadow();
                    var $U = DayPilotMonth.timeRangeSelecting;
                    var $04 = $U.y * 7 + $U.x;
                    var $05 = $J.y * 7 + $J.x;
                    var $t = Math.abs($05 - $04) + 1;
                    if ($t < 1) {
                        $t = 1;
                    };
                    var $06 = $04 < $05 ? $U : $J;
                    DayPilotMonth.timeRangeSelecting.from = {
                        x: $06.x,
                        y: $06.y
                    };
                    DayPilotMonth.timeRangeSelecting.width = $t;
                    DayPilotMonth.timeRangeSelecting.moved = true;
                    $d.drawShadow($06.x, $06.y, 0, $t, 0, null);
                }
            };
        };
        this.updateHeight = function() {
            this.nav.top.style.height = this.getHeight() + 'px';
            for (var x = 0; x < this.cells.length; x++) {
                for (var y = 0; y < this.cells[x].length; y++) {
                    this.cells[x][y].style.top = this.getRowTop(y) + 'px';
                    this.cells[x][y].style.height = this.rows[y].getHeight() + 'px';
                }
            }
        };
        this.getCellBelowPoint = function(x, y) {
            var $07 = Math.floor(this.nav.top.clientWidth / this.getColCount());
            var $08 = Math.min(Math.floor(x / $07), this.getColCount() - 1);
            var $n = null;
            var $B = this.headerHeight;
            var $09 = 0;
            for (var i = 0; i < this.rows.length; i++) {
                var $0a = $B;
                $B += this.rows[i].getHeight();
                if (y < $B) {
                    $09 = y - $0a;
                    $n = i;
                    break;
                }
            };
            if ($n === null) {
                $n = this.rows.length - 1;
            };
            var $J = {};
            $J.x = $08;
            $J.y = $n;
            $J.relativeY = $09;
            return $J;
        };
        this.getCellFromDate = function($0b) {
            var $t = DayPilot.DateUtil.daysDiff(this.firstDate, $0b);
            var $J = {
                x: 0,
                y: 0
            };
            while ($t >= 7) {
                $J.y++;
                $t -= 7;
            };
            $J.x = $t;
            return $J;
        };
        this.$0Z = function() {
            var $0c = document.createElement("div");
            $0c.oncontextmenu = function() {
                return false;
            };
            this.nav.cells.appendChild($0c);
            this.cells = [];
            for (var x = 0; x < this.getColCount(); x++) {
                this.cells[x] = [];
                var $0d = null;
                var $0e = document.createElement("div");
                $0e.setAttribute("unselectable", "on");
                $0e.style.position = 'absolute';
                $0e.style.left = (this.getCellWidth() * x) + '%';
                $0e.style.width = (this.getCellWidth()) + '%';
                $0e.style.top = '0px';
                $0e.style.height = (this.headerHeight) + 'px';
                var $0f = x + this.getWeekStart();
                if ($0f > 6) {
                    $0f -= 7;
                };
                if (this.cssOnly) {
                    $0e.className = this.$15("_header");
                };
                var $M = document.createElement("div");
                $M.setAttribute("unselectable", "on");
                $M.innerHTML = $0g.locale().dayNames[$0f];
                $0e.appendChild($M);
                $M.style.position = "absolute";
                $M.style.top = "0px";
                $M.style.bottom = "0px";
                $M.style.left = "0px";
                $M.style.right = "0px";
                if (this.cssOnly) {
                    $M.className = this.$15("_header_inner");
                } else {
                    $M.style.backgroundColor = this.headerBackColor;
                    $M.style.fontFamily = this.headerFontFamily;
                    $M.style.fontSize = this.headerFontSize;
                    $M.style.color = this.headerFontColor;
                    $M.style.textAlign = 'center';
                    $M.style.cursor = 'default';
                    if (x !== this.getColCount() - 1) {
                        $M.style.borderRight = '1px solid ' + this.borderColor;
                    }
                };
                $M.innerHTML = $0g.locale().dayNames[$0f];
                $0c.appendChild($0e);
                for (var y = 0; y < this.rows.length; y++) {
                    this.drawCell(x, y, $0c);
                }
            }
        };
        this.$0Y = function() {
            for (var x = 0; x < this.cells.length; x++) {
                for (var y = 0; y < this.cells[x].length; y++) {
                    this.cells[x][y].onclick = null;
                }
            };
            this.nav.cells.innerHTML = '';
        };
        this.$16 = function() {
            return $d.api === 2;
        };
        this.drawCell = function(x, y, $0c) {
            var $n = this.rows[y];
            var d = this.firstDate.addDays(y * 7 + x);
            var $0h = this.cellProperties ? this.cellProperties[y * this.getColCount() + x] : null;
            var $J = document.createElement("div");
            $J.setAttribute("unselectable", "on");
            $J.style.position = 'absolute';
            $J.style.cursor = 'default';
            $J.style.left = (this.getCellWidth() * x) + '%';
            $J.style.width = (this.getCellWidth()) + '%';
            $J.style.top = (this.getRowTop(y)) + 'px';
            $J.style.height = ($n.getHeight()) + 'px';
            if (this.cssOnly) {
                $J.className = this.$15("_cell");
                if (!this.isWeekend(d)) {
                    var $0i = this.$15("_cell_business");
                    DayPilot.Util.addClass($J, $0i);
                }
            };
            var $0j = this.startDate.addMonths(-1).getMonth();
            var $0k = this.startDate.addMonths(1).getMonth();
            var $0l = this.startDate.getMonth();
            var $M = document.createElement("div");
            $M.setAttribute("unselectable", "on");
            $J.appendChild($M);
            $M.style.position = "absolute";
            $M.style.left = "0px";
            $M.style.right = "0px";
            $M.style.top = "0px";
            $M.style.bottom = "0px";
            if (this.cssOnly) {
                $M.className = this.$15("_cell_inner");
            } else {
                $M.style.backgroundColor = this.getCellBackColor(d);
                if (x !== this.getColCount() - 1) {
                    $M.style.borderRight = '1px solid ' + this.innerBorderColor;
                };
                if (y === 0) {
                    $M.style.borderTop = '1px solid ' + this.borderColor;
                };
                $M.style.borderBottom = '1px solid ' + this.innerBorderColor;
            };
            $J.onmousedown = function(e) {
                if ($d.timeRangeSelectedHandling !== 'Disabled') {
                    $d.clearShadow();
                    DayPilotMonth.timeRangeSelecting = {
                        "root": $d,
                        "x": x,
                        "y": y,
                        "from": {
                            x: x,
                            y: y
                        },
                        "width": 1
                    };
                }
            };
            $J.onclick = function() {
                var $0m = function(d) {
                    var $U = new DayPilot.Date(d);
                    var end = $U.addDays(1);
                    $d.timeRangeSelectedDispatch($U, end);
                };
                if ($d.timeRangeSelectedHandling !== 'Disabled') {
                    $0m(d);
                    return;
                }
            };
            var $0n = document.createElement("div");
            $0n.setAttribute("unselectable", "on");
            $0n.style.height = this.cellHeaderHeight + "px";
            if (this.cssOnly) {
                $0n.className = this.$15("_cell_header");
            } else {
                if (this.cellHeaderBackColor) {
                    $0n.style.backgroundColor = this.cellHeaderBackColor;
                };
                $0n.style.paddingRight = '2px';
                $0n.style.textAlign = "right";
                $0n.style.fontFamily = this.cellHeaderFontFamily;
                $0n.style.fontSize = this.cellHeaderFontSize;
                $0n.style.color = this.cellHeaderFontColor;
            };
            var $0b = d.getDay();
            if ($0b === 1) {
                $0n.innerHTML = $0g.locale().monthNames[d.getMonth()] + ' ' + $0b;
            } else {
                $0n.innerHTML = $0b;
            };
            $M.appendChild($0n);
            this.cells[x][y] = $J;
            $0c.appendChild($J);
        };
        this.getWeekStart = function() {
            return $0g.locale().weekStarts;
        };
        this.getColCount = function() {
            return 7;
        };
        this.getCellWidth = function() {
            return 14.285;
        };
        this.getCellBackColor = function(d) {
            if (d.getDayOfWeek() === 6 || d.getDayOfWeek() === 0) {
                return this.nonBusinessBackColor;
            };
            return this.backColor;
        };
        this.getRowTop = function($k) {
            var top = this.headerHeight;
            for (var i = 0; i < $k; i++) {
                top += this.rows[i].getHeight();
            };
            return top;
        };
        this.$17 = function($0o, $g, $0p) {
            var $0q = {};
            $0q.action = $0o;
            $0q.parameters = $0p;
            $0q.data = $g;
            $0q.header = this.$18();
            var $0r = "JSON" + DayPilot.JSON.stringify($0q);
            if (this.backendUrl) {
                DayPilot.request(this.backendUrl, this.callBackResponse, $0r, this.ajaxError);
            }
        };
        this.callBackResponse = function($0s) {
            $d.updateView($0s.responseText);
        };
        this.$18 = function() {
            var h = {};
            h.control = "dpm";
            h.id = this.id;
            h.v = this.v;
            h.visibleStart = new DayPilot.Date(this.firstDate);
            h.visibleEnd = h.visibleStart.addDays(this.days);
            h.startDate = $d.startDate;
            h.headerBackColor = this.headerBackColor;
            h.backColor = this.backColor;
            h.nonBusinessBackColor = this.nonBusinessBackColor;
            h.timeFormat = this.timeFormat;
            h.weekStarts = this.weekStarts;
            return h;
        };
        this.eventClickCallBack = function(e, $g) {
            this.$17('EventClick', $g, e);
        };
        this.eventClickDispatch = function(e) {
            DayPilotMonth.movingEvent = null;
            DayPilotMonth.resizingEvent = null;
            var $F = this;
            var e = e || window.event;
            var $0t = e.ctrlKey;
            e.cancelBubble = true;
            if (e.stopPropagation) {
                e.stopPropagation();
            };
            $d.eventClickSingle($F, $0t);
        };
        this.eventClickSingle = function($F) {
            var e = $F.event;
            if (!e.client.clickEnabled()) {
                return;
            };
            if ($d.$16()) {
                var $0u = {};
                $0u.e = e;
                $0u.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $d.onEventClick === 'function') {
                    $d.$11.apply(function() {
                        $d.onEventClick($0u);
                    });
                    if ($0u.preventDefault.value) {
                        return;
                    }
                };
                switch ($d.eventClickHandling) {
                    case 'CallBack':
                        $d.eventClickCallBack(e);
                        break;
                };
                if (typeof $d.onEventClicked === 'function') {
                    $d.$11.apply(function() {
                        $d.onEventClicked($0u);
                    });
                }
            } else {
                switch ($d.eventClickHandling) {
                    case 'CallBack':
                        $d.eventClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $d.onEventClick(e);
                        break;
                }
            }
        };
        this.eventMoveCallBack = function(e, $0v, $0w, $g, $0x) {
            if (!$0v) throw 'newStart is null';
            if (!$0w) throw 'newEnd is null';
            var $0y = {};
            $0y.e = e;
            $0y.newStart = $0v;
            $0y.newEnd = $0w;
            $0y.position = $0x;
            this.$17('EventMove', $g, $0y);
        };
        this.eventMoveDispatch = function(e, x, y, $u, ev, $0x) {
            var $0z = e.start().getTimePart();
            var $03 = e.end().getDatePart();
            if ($03 !== e.end()) {
                $03 = $03.addDays(1);
            };
            var $0A = DayPilot.DateUtil.diff(e.end(), $03);
            var $0B = this.getDateFromCell(x, y);
            $0B = $0B.addDays(-$u);
            var $t = DayPilot.DateUtil.daysSpan(e.start(), e.end()) + 1;
            var $0C = $0B.addDays($t);
            var $0v = $0B.addTime($0z);
            var $0w = $0C.addTime($0A);
            if ($d.$16()) {
                var $0u = {};
                $0u.e = e;
                $0u.newStart = $0v;
                $0u.newEnd = $0w;
                $0u.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $d.onEventMove === 'function') {
                    $d.$11.apply(function() {
                        $d.onEventMove($0u);
                    });
                    if ($0u.preventDefault.value) {
                        return;
                    }
                };
                switch ($d.eventMoveHandling) {
                    case 'CallBack':
                        $d.eventMoveCallBack(e, $0v, $0w);
                        break;
                    case 'Update':
                        e.start($0v);
                        e.end($0w);
                        $d.events.update(e);
                        break;
                };
                if (typeof $d.onEventMoved === 'function') {
                    $d.$11.apply(function() {
                        $d.onEventMoved($0u);
                    });
                }
            } else {
                switch ($d.eventMoveHandling) {
                    case 'CallBack':
                        $d.eventMoveCallBack(e, $0v, $0w);
                        break;
                    case 'JavaScript':
                        $d.onEventMove(e, $0v, $0w);
                        break;
                }
            }
        };
        this.eventResizeCallBack = function(e, $0v, $0w, $g) {
            if (!$0v) throw 'newStart is null';
            if (!$0w) throw 'newEnd is null';
            var $0y = {};
            $0y.e = e;
            $0y.newStart = $0v;
            $0y.newEnd = $0w;
            this.$17('EventResize', $g, $0y);
        };
        this.eventResizeDispatch = function(e, $U, $t) {
            var $0z = e.start().getTimePart();
            var $03 = e.end().getDatePart();
            if ($03 !== e.end()) {
                $03 = $03.addDays(1);
            };
            var $0A = DayPilot.DateUtil.diff(e.end(), $03);
            var $0B = this.getDateFromCell($U.x, $U.y);
            var $0C = $0B.addDays($t);
            var $0v = $0B.addTime($0z);
            var $0w = $0C.addTime($0A);
            if ($d.$16()) {
                var $0u = {};
                $0u.e = e;
                $0u.newStart = $0v;
                $0u.newEnd = $0w;
                $0u.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $d.onEventResize === 'function') {
                    $d.$11.apply(function() {
                        $d.onEventResize($0u);
                    });
                    if ($0u.preventDefault.value) {
                        return;
                    }
                };
                switch ($d.eventResizeHandling) {
                    case 'CallBack':
                        $d.eventResizeCallBack(e, $0v, $0w);
                        break;
                    case 'Update':
                        e.start($0v);
                        e.end($0w);
                        $d.events.update(e);
                        break;
                };
                if (typeof $d.onEventResized === 'function') {
                    $d.$11.apply(function() {
                        $d.onEventResized($0u);
                    });
                }
            } else {
                switch ($d.eventResizeHandling) {
                    case 'CallBack':
                        $d.eventResizeCallBack(e, $0v, $0w);
                        break;
                    case 'JavaScript':
                        $d.onEventResize(e, $0v, $0w);
                        break;
                }
            }
        };
        this.timeRangeSelectedCallBack = function($U, end, $g) {
            var $0D = {};
            $0D.start = $U;
            $0D.end = end;
            this.$17('TimeRangeSelected', $g, $0D);
        };
        this.timeRangeSelectedDispatch = function($U, end) {
            if (this.$16()) {
                var $0u = {};
                $0u.start = $U;
                $0u.end = end;
                $0u.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $d.onTimeRangeSelect === 'function') {
                    $d.$11.apply(function() {
                        $d.onTimeRangeSelect($0u);
                    });
                    if ($0u.preventDefault.value) {
                        return;
                    }
                };
                switch ($d.timeRangeSelectedHandling) {
                    case 'CallBack':
                        $d.timeRangeSelectedCallBack($U, end);
                        break;
                };
                if (typeof $d.onTimeRangeSelected === 'function') {
                    $d.$11.apply(function() {
                        $d.onTimeRangeSelected($0u);
                    });
                }
            } else {
                switch ($d.timeRangeSelectedHandling) {
                    case 'CallBack':
                        $d.timeRangeSelectedCallBack($U, end);
                        break;
                    case 'JavaScript':
                        $d.onTimeRangeSelected($U, end);
                        break;
                }
            }
        };
        this.$11 = {};
        this.$11.scope = null;
        this.$11.notify = function() {
            if ($d.$11.scope) {
                $d.$11.scope["$apply"]();
            }
        };
        this.$11.apply = function(f) {
            if ($d.angularAutoApply && $d.$11.scope) {
                $d.$11.scope["$apply"](f);
            } else {
                f();
            }
        };
        this.clearSelection = function() {
            $d.clearShadow();
        };
        this.commandCallBack = function($0E, $g) {
            var $0y = {};
            $0y.command = $0E;
            this.$17('Command', $g, $0y);
        };
        this.isWeekend = function($0b) {
            $0b = new DayPilot.Date($0b);
            var $0F = 0;
            var $0G = 6;
            if ($0b.dayOfWeek() === $0F) {
                return true;
            };
            if ($0b.dayOfWeek() === $0G) {
                return true;
            };
            return false;
        };
        this.$19 = {};
        this.$19.locale = function() {
            var $0H = DayPilot.Locale.find($d.locale);
            if (!$0H) {
                return DayPilot.Locale.US;
            };
            return $0H;
        };
        var $0g = this.$19;
        this.debug = function($0I, $0J) {
            if (!this.debuggingEnabled) {
                return;
            };
            if (!$d.debugMessages) {
                $d.debugMessages = [];
            };
            $d.debugMessages.push($0I);
            if (typeof console !== 'undefined') {
                console.log($0I);
            }
        };
        this.registerGlobalHandlers = function() {
            if (!DayPilotMonth.globalHandlers) {
                DayPilotMonth.globalHandlers = true;
                DayPilot.re(document, 'mouseup', DayPilotMonth.gMouseUp);
            }
        };
        this.loadFromServer = function() {
            if (this.backendUrl || typeof WebForm_DoCallback === 'function') {
                return (typeof $d.events.list === 'undefined') || (!$d.events.list);
            } else {
                return false;
            }
        };
        this.show = function() {
            if (this.nav.top.style.visibility === 'hidden') {
                this.nav.top.style.visibility = 'visible';
            }
        };
        this.$1a = function() {
            if (this.id && this.id.tagName) {
                this.nav.top = this.id;
            } else if (typeof this.id === "string") {
                this.nav.top = document.getElementById(this.id);
                if (!this.nav.top) {
                    throw "DayPilot.Month: The placeholder element not found: '" + id + "'.";
                }
            } else {
                throw "DayPilot.Month() constructor requires the target element or its ID as a parameter";
            }
        };
        this.$12 = function() {
            if (!$d.cssOnly) {
                $d.cssOnly = true;
                window.console && window.console.log && window.console.log("DayPilot: cssOnly = false mode is not supported anymore.");
            }
        };
        this.$1b = function() {
            this.$0W();
            this.drawTop();
            this.$0Z();
            this.registerGlobalHandlers();
            this.$17('Init');
        };
        this.init = function() {
            this.$1a();
            var $0K = this.loadFromServer();
            this.$12();
            loadDefaultCss();
            if ($0K) {
                this.$1b();
                return;
            };
            this.$0W();
            this.$0X();
            this.drawTop();
            this.$0Z();
            this.show();
            this.$10();
            this.registerGlobalHandlers();
            if (this.messageHTML) {
                this.message(this.messageHTML);
            };
            this.fireAfterRenderDetached(null, false);
        };
        this.Init = this.init;
    };
    DayPilotMonth.gMouseUp = function(ev) {
        if (DayPilotMonth.movingEvent) {
            var $0L = DayPilotMonth.movingEvent;
            if (!$0L.event) {
                return;
            };
            if (!$0L.event.calendar) {
                return;
            };
            if (!$0L.event.calendar.shadow) {
                return;
            };
            if (!$0L.event.calendar.shadow.start) {
                return;
            };
            var $d = DayPilotMonth.movingEvent.event.calendar;
            var e = DayPilotMonth.movingEvent.event;
            var $U = $d.shadow.start;
            var $0x = $d.shadow.position;
            var $u = DayPilotMonth.movingEvent.offset;
            $d.clearShadow();
            DayPilotMonth.movingEvent = null;
            var ev = ev || window.event;
            $d.eventMoveDispatch(e, $U.x, $U.y, $u, ev, $0x);
            ev.cancelBubble = true;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            };
            DayPilotMonth.movingEvent = null;
            return false;
        } else if (DayPilotMonth.resizingEvent) {
            var $0L = DayPilotMonth.resizingEvent;
            if (!$0L.event) {
                return;
            };
            if (!$0L.event.calendar) {
                return;
            };
            if (!$0L.event.calendar.shadow) {
                return;
            };
            if (!$0L.event.calendar.shadow.start) {
                return;
            };
            var $d = DayPilotMonth.resizingEvent.event.calendar;
            var e = DayPilotMonth.resizingEvent.event;
            var $U = $d.shadow.start;
            var $t = $d.shadow.width;
            $d.clearShadow();
            DayPilotMonth.resizingEvent = null;
            $d.eventResizeDispatch(e, $U, $t);
            ev.cancelBubble = true;
            DayPilotMonth.resizingEvent = null;
            return false;
        } else if (DayPilotMonth.timeRangeSelecting) {
            if (DayPilotMonth.timeRangeSelecting.moved) {
                var $0M = DayPilotMonth.timeRangeSelecting;
                var $d = $0M.root;
                var $U = new DayPilot.Date($d.getDateFromCell($0M.from.x, $0M.from.y));
                var end = $U.addDays($0M.width);
                $d.timeRangeSelectedDispatch($U, end);
                $d.clearShadow();
            };
            DayPilotMonth.timeRangeSelecting = null;
        }
    };
    DayPilot.Month = DayPilotMonth.Month;
    if (typeof jQuery !== 'undefined') {
        (function($) {
            $.fn.daypilotMonth = function($0N) {
                var $W = null;
                var j = this.each(function() {
                    if (this.daypilot) {
                        return;
                    };
                    var $0O = new DayPilot.Month(this.id);
                    this.daypilot = $0O;
                    for (name in $0N) {
                        $0O[name] = $0N[name];
                    };
                    $0O.Init();
                    if (!$W) {
                        $W = $0O;
                    }
                });
                if (this.length === 1) {
                    return $W;
                } else {
                    return j;
                }
            };
        })(jQuery);
    };
    (function registerAngularModule() {
        var $0P = DayPilot.am();
        if (!$0P) {
            return;
        };
        $0P.directive("daypilotMonth", function() {
            return {
                "restrict": "E",
                "template": "<div></div>",
                "replace": true,
                "link": function($0Q, element, $0R) {
                    var $d = new DayPilot.Month(element[0]);
                    $d.$11.scope = $0Q;
                    $d.init();
                    var $0S = $0R["id"];
                    if ($0S) {
                        $0Q[$0S] = $d;
                    };
                    var $0T = $0Q["$watch"];
                    $0T.call($0Q, $0R["daypilotConfig"], function($0U) {
                        for (var name in $0U) {
                            $d[name] = $0U[name];
                        };
                        $d.update();
                    }, true);
                    $0T.call($0Q, $0R["daypilotEvents"], function($0U) {
                        $d.events.list = $0U;
                        $d.update();
                    }, true);
                }
            };
        });
    })();
    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }
})();

if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilot.Global === 'undefined') {
    DayPilot.Global = {};
};
(function() {
    if (typeof DayPilot.Navigator !== 'undefined') {
        return;
    };

    function loadDefaultCss() {
        if (DayPilot.Global.defaultNavigatorCss) {
            return;
        };
        var $a = DayPilot.sheet();
        $a.add(".navigator_default_main", "border-left: 1px solid #A0A0A0;border-right: 1px solid #A0A0A0;border-bottom: 1px solid #A0A0A0;background-color: white;color: #000000;");
        $a.add(".navigator_default_main *, .navigator_default_main *:before, .navigator_default_main *:after", "box-sizing: content-box;");
        $a.add(".navigator_default_month", "font-family: Tahoma;font-size: 11px;");
        $a.add(".navigator_default_day", "color: black;");
        $a.add(".navigator_default_weekend", "background-color: #f0f0f0;");
        $a.add(".navigator_default_dayheader", "color: black;");
        $a.add(".navigator_default_line", "border-bottom: 1px solid #A0A0A0;");
        $a.add(".navigator_default_dayother", "color: gray;");
        $a.add(".navigator_default_todaybox", "border: 1px solid red;");
        $a.add(".navigator_default_select, .navigator_default_weekend.navigator_default_select", "background-color: #FFE794;");
        $a.add(".navigator_default_title, .navigator_default_titleleft, .navigator_default_titleright", 'border-top: 1px solid #A0A0A0;color: #666;background: #eee;background: -webkit-gradient(linear, left top, left bottom, from(#eeeeee), to(#dddddd));background: -webkit-linear-gradient(top, #eeeeee 0%, #dddddd);background: -moz-linear-gradient(top, #eeeeee 0%, #dddddd);background: -ms-linear-gradient(top, #eeeeee 0%, #dddddd);background: -o-linear-gradient(top, #eeeeee 0%, #dddddd);background: linear-gradient(top, #eeeeee 0%, #dddddd);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#eeeeee", endColorStr="#dddddd");');
        $a.add(".navigator_default_busy", "font-weight: bold;");
        $a.commit();
        DayPilot.Global.defaultNavigatorCss = true;
    };
    DayPilotNavigator = {};
    DayPilot.Navigator = function(id) {
        this.v = '192-lite';
        var $b = this;
        this.id = id;
        this.api = 2;
        this.isNavigator = true;
        this.angularAutoApply = true;
        this.weekStarts = 'Auto';
        this.selectMode = 'day';
        this.titleHeight = 20;
        this.dayHeaderHeight = 20;
        this.cellWidth = 20;
        this.cellHeight = 20;
        this.cssOnly = true;
        this.selectionStart = null;
        this.selectionEnd = null;
        this.selectionDay = new DayPilot.Date().getDatePart();
        this.showMonths = 1;
        this.skipMonths = 1;
        this.command = "navigate";
        this.year = new DayPilot.Date().getYear();
        this.month = new DayPilot.Date().getMonth() + 1;
        this.locale = "en-us";
        this.theme = "navigator_default";
        this.timeRangeSelectedHandling = "Bind";
        this.onTimeRangeSelect = null;
        this.onTimeRangeSelected = null;
        this.nav = {};
        this.$02 = function() {
            this.root.dp = this;
            if (this.cssOnly) {
                this.root.className = this.$03('_main');
            } else {
                this.root.className = this.$03('main');
            };
            this.root.style.width = (this.cellWidth * 7) + 'px';
            this.root.style.position = "relative";
            var $c = document.createElement("input");
            $c.type = 'hidden';
            $c.name = $b.id + "_state";
            $c.id = $c.name;
            this.root.appendChild($c);
            this.state = $c;
            if (!this.startDate) {
                this.startDate = new DayPilot.Date(DayPilot.Date.fromYearMonthDay(this.year, this.month));
            } else {
                this.startDate = new DayPilot.Date(this.startDate).firstDayOfMonth();
            };
            this.calendars = [];
            this.selected = [];
            this.months = [];
        };
        this.$04 = function() {
            return $b.api === 2;
        };
        this.$05 = function() {
            this.root.innerHTML = '';
        };
        this.$03 = function($d) {
            var $e = this.theme || this.cssClassPrefix;
            if ($e) {
                return $e + $d;
            } else {
                return "";
            }
        };
        this.$06 = function($f, name) {
            var $g = this.cssOnly ? this.$03("_" + name) : this.$03(name);
            DayPilot.Util.addClass($f, $g);
        };
        this.$07 = function($f, name) {
            var $g = this.cssOnly ? this.$03("_" + name) : this.$03(name);
            DayPilot.Util.removeClass($f, $g);
        };
        this.$08 = function(j, $h) {
            var $i = {};
            $i.cells = [];
            $i.days = [];
            $i.weeks = [];
            var $j = this.startDate.addMonths(j);
            var $k = $h.before;
            var $l = $h.after;
            var $m = $j.firstDayOfMonth();
            var $n = $m.firstDayOfWeek($o.weekStarts());
            var $p = $m.addMonths(1);
            var $q = DayPilot.DateUtil.daysDiff($n, $p);
            var $r = 6;
            $i.rowCount = $r;
            var $s = (new DayPilot.Date()).getDatePart();
            var $t = this.cellWidth * 7;
            var $u = this.cellHeight * $r + this.titleHeight + this.dayHeaderHeight;
            $i.height = $u;
            var $v = document.createElement("div");
            $v.style.width = ($t) + 'px';
            $v.style.height = ($u) + 'px';
            $v.style.position = 'relative';
            if (this.cssOnly) {
                $v.className = this.$03('_month');
            } else {
                $v.className = this.$03('month');
            };
            $v.style.cursor = 'default';
            $v.style.MozUserSelect = 'none';
            $v.style.KhtmlUserSelect = 'none';
            $v.style.WebkitUserSelect = 'none';
            $v.month = $i;
            this.root.appendChild($v);
            var $w = this.titleHeight + this.dayHeaderHeight;
            var tl = document.createElement("div");
            tl.style.position = 'absolute';
            tl.style.left = '0px';
            tl.style.top = '0px';
            tl.style.width = this.cellWidth + 'px';
            tl.style.height = this.titleHeight + 'px';
            tl.style.lineHeight = this.titleHeight + 'px';
            tl.style.textAlign = 'left';
            tl.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                tl.className = this.$03('_titleleft');
            } else {
                tl.className = this.$03('titleleft');
            };
            if ($h.left) {
                tl.style.cursor = 'pointer';
                tl.innerHTML = "<span style='margin-left:2px;'>&lt;</span>";
                tl.onclick = this.$09;
            };
            $v.appendChild(tl);
            this.tl = tl;
            var ti = document.createElement("div");
            ti.style.position = 'absolute';
            ti.style.left = this.cellWidth + 'px';
            ti.style.top = '0px';
            ti.style.width = (this.cellWidth * 5) + 'px';
            ti.style.height = this.titleHeight + 'px';
            ti.style.lineHeight = this.titleHeight + 'px';
            ti.style.textAlign = 'center';
            ti.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                ti.className = this.$03('_title');
            } else {
                ti.className = this.$03('title');
            };
            ti.innerHTML = $o.locale().monthNames[$j.getMonth()] + ' ' + $j.getYear();
            $v.appendChild(ti);
            this.ti = ti;
            var tr = document.createElement("div");
            tr.style.position = 'absolute';
            tr.style.left = (this.cellWidth * 6) + 'px';
            tr.style.top = '0px';
            tr.style.width = this.cellWidth + 'px';
            tr.style.height = this.titleHeight + 'px';
            tr.style.lineHeight = this.titleHeight + 'px';
            tr.style.textAlign = 'right';
            tr.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                tr.className = this.$03('_titleright');
            } else {
                tr.className = this.$03('titleright');
            };
            if ($h.right) {
                tr.style.cursor = 'pointer';
                tr.innerHTML = "<span style='margin-right:2px;'>&gt;</span>";
                tr.onclick = this.$0a;
            };
            $v.appendChild(tr);
            this.tr = tr;
            for (var x = 0; x < 7; x++) {
                $i.cells[x] = [];
                var dh = document.createElement("div");
                dh.style.position = 'absolute';
                dh.style.left = (x * this.cellWidth) + 'px';
                dh.style.top = this.titleHeight + 'px';
                dh.style.width = this.cellWidth + 'px';
                dh.style.height = this.dayHeaderHeight + 'px';
                dh.style.lineHeight = this.dayHeaderHeight + 'px';
                dh.style.textAlign = 'right';
                dh.setAttribute("unselectable", "on");
                if (this.cssOnly) {
                    dh.className = this.$03('_dayheader');
                } else {
                    dh.className = this.$03('dayheader');
                };
                dh.innerHTML = "<span style='margin-right: 2px'>" + this.$0b(x) + "</span>";
                $v.appendChild(dh);
                $i.days.push(dh);
                for (var y = 0; y < $r; y++) {
                    var $x = $n.addDays(y * 7 + x);
                    var $y = this.$0c($x) && this.$0d() !== 'none';
                    var $z = $x.getMonth() === $j.getMonth();
                    var $A = $x.getTime() < $j.getTime();
                    var $B = $x.getTime() > $j.getTime();
                    var $C;
                    var dc = document.createElement("div");
                    dc.day = $x;
                    dc.x = x;
                    dc.y = y;
                    dc.isCurrentMonth = $z;
                    if (this.cssOnly) {
                        dc.className = this.$03(($z ? '_day' : '_dayother'));
                    } else {
                        dc.className = this.$03(($z ? 'day' : 'dayother'));
                    };
                    if ($x.getTime() === $s.getTime() && $z) {
                        this.$06(dc, 'today');
                    };
                    if ($x.dayOfWeek() === 0 || $x.dayOfWeek() === 6) {
                        this.$06(dc, 'weekend');
                    };
                    dc.style.position = 'absolute';
                    dc.style.left = (x * this.cellWidth) + 'px';
                    dc.style.top = (y * this.cellHeight + $w) + 'px';
                    dc.style.width = this.cellWidth + 'px';
                    dc.style.height = this.cellHeight + 'px';
                    dc.style.lineHeight = this.cellHeight + 'px';
                    dc.style.textAlign = 'right';
                    var $D = document.createElement("div");
                    $D.style.position = 'absolute';
                    if (this.cssOnly) {
                        $D.className = ($x.getTime() === $s.getTime() && $z) ? this.$03('_todaybox') : this.$03('_daybox');
                    } else {
                        $D.className = ($x.getTime() === $s.getTime() && $z) ? this.$03('todaybox') : this.$03('daybox');
                    };
                    $D.style.left = '0px';
                    $D.style.top = '0px';
                    $D.style.width = (this.cellWidth - 2) + 'px';
                    $D.style.height = (this.cellHeight - 2) + 'px';
                    dc.appendChild($D);
                    var $E = null;
                    if (this.cells && this.cells[$x.toStringSortable()]) {
                        $E = this.cells[$x.toStringSortable()];
                        if ($E.css) {
                            this.$06(dc, $E.css);
                        }
                    };
                    var $F = null;
                    if ($z || ($k && $A) || ($l && $B)) {
                        $F = document.createElement("span");
                        $F.innerHTML = $x.getDay();
                        dc.style.cursor = 'pointer';
                        dc.isClickable = true;
                        if ($y) {
                            this.$06(dc, 'select');
                        };
                        if ($E && $E.html) {
                            $F.innerHTML = $E.html;
                        };
                        $F.style.marginRight = '2px';
                        dc.appendChild($F);
                    };
                    dc.setAttribute("unselectable", "on");
                    dc.onclick = this.$0e;
                    dc.onmousedown = this.$0f;
                    dc.onmousemove = this.$0g;
                    if ($y) {
                        this.selected.push(dc);
                    };
                    $v.appendChild(dc);
                    $i.cells[x][y] = dc;
                }
            };
            var $G = document.createElement("div");
            $G.style.position = 'absolute';
            $G.style.left = '0px';
            $G.style.top = ($w - 2) + 'px';
            $G.style.width = (this.cellWidth * 7) + 'px';
            $G.style.height = '1px';
            $G.style.fontSize = '1px';
            $G.style.lineHeight = '1px';
            if (this.cssOnly) {
                $G.className = this.$03("_line");
            } else {
                $G.className = this.$03("line");
            };
            $v.appendChild($G);
            this.months.push($i);
        };
        this.$0d = function() {
            var $H = this.selectMode || "";
            return $H.toLowerCase();
        };
        this.$0h = function() {
            var $H = $b.$0d();
            switch ($H) {
                case 'day':
                    this.selectionStart = this.selectionDay;
                    this.selectionEnd = this.selectionStart;
                    break;
                case 'week':
                    this.selectionStart = this.selectionDay.firstDayOfWeek($o.weekStarts());
                    this.selectionEnd = this.selectionStart.addDays(6);
                    break;
                case 'month':
                    this.selectionStart = this.selectionDay.firstDayOfMonth();
                    this.selectionEnd = this.selectionDay.lastDayOfMonth();
                    break;
                case 'none':
                    this.selectionStart = this.selectionDay;
                    this.selectionEnd = this.selectionStart;
                    break;
                default:
                    throw "Unknown selectMode value.";
            }
        };
        this.select = function($I) {
            var $J = true;
            var $K = this.selectionStart;
            var $L = this.selectionEnd;
            this.selectionStart = new DayPilot.Date($I).getDatePart();
            this.selectionDay = this.selectionStart;
            var $M = false;
            if ($J) {
                var $N = this.startDate;
                if (this.selectionStart.getTime() < this.visibleStart().getTime() || this.selectionStart.getTime() > this.visibleEnd().getTime()) {
                    $N = this.selectionStart.firstDayOfMonth();
                };
                if ($N.toStringSortable() !== this.startDate.toStringSortable()) {
                    $M = true;
                };
                this.startDate = $N;
            };
            this.$0h();
            this.$05();
            this.$02();
            this.$0i();
            if (!$K.equals(this.selectionStart) || !$L.equals(this.selectionEnd)) {
                this.$0j();
            }
        };
        this.update = function() {
            this.$0k();
            this.$0h();
            this.$05();
            this.$02();
            this.$0i();
        };
        this.$0b = function(i) {
            var x = i + $o.weekStarts();
            if (x > 6) {
                x -= 7;
            };
            return $o.locale().dayNamesShort[x];
        };
        this.$0c = function($I) {
            if (this.selectionStart === null || this.selectionEnd === null) {
                return false;
            };
            if (this.selectionStart.getTime() <= $I.getTime() && $I.getTime() <= this.selectionEnd.getTime()) {
                return true;
            };
            return false;
        };
        this.$0f = function(ev) {};
        this.$0g = function(ev) {};
        this.$0e = function(ev) {
            var $i = this.parentNode.month;
            var x = this.x;
            var y = this.y;
            var $x = $i.cells[x][y].day;
            if (!$i.cells[x][y].isClickable) {
                return;
            };
            $b.clearSelection();
            $b.selectionDay = $x;
            var $x = $b.selectionDay;
            switch ($b.$0d()) {
                case 'none':
                    $b.selectionStart = $x;
                    $b.selectionEnd = $x;
                    break;
                case 'day':
                    var s = $i.cells[x][y];
                    $b.$06(s, 'select');
                    $b.selected.push(s);
                    $b.selectionStart = s.day;
                    $b.selectionEnd = s.day;
                    break;
                case 'week':
                    for (var j = 0; j < 7; j++) {
                        $b.$06($i.cells[j][y], 'select');
                        $b.selected.push($i.cells[j][y]);
                    };
                    $b.selectionStart = $i.cells[0][y].day;
                    $b.selectionEnd = $i.cells[6][y].day;
                    break;
                case 'month':
                    var $O = null;
                    var end = null;
                    for (var y = 0; y < 6; y++) {
                        for (var x = 0; x < 7; x++) {
                            var s = $i.cells[x][y];
                            if (!s) {
                                continue;
                            };
                            if (s.day.getYear() === $x.getYear() && s.day.getMonth() === $x.getMonth()) {
                                $b.$06(s, 'select');
                                $b.selected.push(s);
                                if ($O === null) {
                                    $O = s.day;
                                };
                                end = s.day;
                            }
                        }
                    };
                    $b.selectionStart = $O;
                    $b.selectionEnd = end;
                    break;
                default:
                    throw 'unknown selectMode';
            };
            $b.$0j();
        };
        this.$0j = function() {
            var $O = $b.selectionStart;
            var end = $b.selectionEnd.addDays(1);
            var $q = DayPilot.DateUtil.daysDiff($O, end);
            var $x = $b.selectionDay;
            if ($b.$04()) {
                var $P = {};
                $P.start = $O;
                $P.end = end;
                $P.day = $x;
                $P.days = $q;
                $P.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onTimeRangeSelect === 'function') {
                    $b.$0l.apply(function() {
                        $b.onTimeRangeSelect($P);
                    });
                    if ($P.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.timeRangeSelectedHandling) {
                    case 'Bind':
                        var $Q = eval($b.bound);
                        if ($Q) {
                            var $R = {};
                            $R.start = $O;
                            $R.end = end;
                            $R.days = $q;
                            $R.day = $x;
                            $Q.commandCallBack($b.command, $R);
                        };
                        break;
                    case 'None':
                        break;
                };
                if (typeof $b.onTimeRangeSelected === 'function') {
                    $b.$0l.apply(function() {
                        $b.onTimeRangeSelected($P);
                    });
                }
            } else {
                switch ($b.timeRangeSelectedHandling) {
                    case 'Bind':
                        var $Q = eval($b.bound);
                        if ($Q) {
                            var $R = {};
                            $R.start = $O;
                            $R.end = end;
                            $R.days = $q;
                            $R.day = $x;
                            $Q.commandCallBack($b.command, $R);
                        };
                        break;
                    case 'JavaScript':
                        $b.onTimeRangeSelected($O, end, $x);
                        break;
                    case 'None':
                        break;
                }
            }
        };
        this.$0a = function(ev) {
            $b.$0m($b.skipMonths);
        };
        this.$09 = function(ev) {
            $b.$0m(-$b.skipMonths);
        };
        this.$0m = function(i) {
            this.startDate = this.startDate.addMonths(i);
            this.$05();
            this.$02();
            this.$0i();
        };
        this.visibleStart = function() {
            return $b.startDate.firstDayOfMonth().firstDayOfWeek($o.weekStarts());
        };
        this.visibleEnd = function() {
            return $b.startDate.firstDayOfMonth().addMonths(this.showMonths - 1).firstDayOfWeek($o.weekStarts()).addDays(42);
        };
        this.$0i = function() {
            for (var j = 0; j < this.showMonths; j++) {
                var $h = this.$0n(j);
                this.$08(j, $h);
            };
            this.root.style.height = this.$0o() + "px";
        };
        this.$0o = function() {
            var $S = 0;
            for (var i = 0; i < this.months.length; i++) {
                var $i = this.months[i];
                $S += $i.height;
            };
            return $S;
        };
        this.$0n = function(j) {
            if (this.internal.showLinks) {
                return this.internal.showLinks;
            };
            var $h = {};
            $h.left = (j === 0);
            $h.right = (j === 0);
            $h.before = j === 0;
            $h.after = j === this.showMonths - 1;
            return $h;
        };
        this.internal = {};
        this.$0p = {};
        var $o = this.$0p;
        $o.locale = function() {
            return DayPilot.Locale.find($b.locale);
        };
        $o.weekStarts = function() {
            if ($b.weekStarts === 'Auto') {
                var $T = $o.locale();
                if ($T) {
                    return $T.weekStarts;
                } else {
                    return 0;
                }
            } else {
                return $b.weekStarts;
            }
        };
        this.clearSelection = function() {
            for (var j = 0; j < this.selected.length; j++) {
                this.$07(this.selected[j], 'select');
            };
            this.selected = [];
        };
        this.$0l = {};
        this.$0l.scope = null;
        this.$0l.notify = function() {
            if ($b.$0l.scope) {
                $b.$0l.scope["$apply"]();
            }
        };
        this.$0l.apply = function(f) {
            if ($b.angularAutoApply && $b.$0l.scope) {
                $b.$0l.scope["$apply"](f);
            } else {
                f();
            }
        };
        this.$0q = function() {
            if (this.backendUrl || typeof WebForm_DoCallback === 'function') {
                return (typeof $b.items === 'undefined') || (!$b.items);
            } else {
                return false;
            }
        };
        this.$0k = function() {
            if (!$b.cssOnly) {
                $b.cssOnly = true;
                window.console && window.console.log && window.console.log("DayPilot: cssOnly = false mode is not supported anymore.");
            }
        };
        this.$0r = function() {
            if (this.id && this.id.tagName) {
                this.nav.top = this.id;
            } else if (typeof this.id === "string") {
                this.nav.top = document.getElementById(this.id);
                if (!this.nav.top) {
                    throw "DayPilot.Navigator: The placeholder element not found: '" + id + "'.";
                }
            } else {
                throw "DayPilot.Navigator() constructor requires the target element or its ID as a parameter";
            };
            this.root = this.nav.top;
        };
        this.init = function() {
            this.$0r();
            this.$0k();
            loadDefaultCss();
            if (this.root.dp) {
                return;
            };
            this.$0h();
            this.$02();
            this.$0i();
            this.$0s();
            this.initialized = true;
        };
        this.dispose = function() {
            var c = $b;
            if (!c.root) {
                return;
            };
            c.root.removeAttribute("style");
            c.root.removeAttribute("class");
            c.root.dp = null;
            c.root.innerHTML = null;
            c.root = null;
        };
        this.$0s = function() {
            this.root.dispose = this.dispose;
        };
        this.Init = this.init;
    };
    if (typeof jQuery !== 'undefined') {
        (function($) {
            $.fn.daypilotNavigator = function($U) {
                var $n = null;
                var j = this.each(function() {
                    if (this.daypilot) {
                        return;
                    };
                    var $V = new DayPilot.Navigator(this.id);
                    this.daypilot = $V;
                    for (var name in $U) {
                        $V[name] = $U[name];
                    };
                    $V.Init();
                    if (!$n) {
                        $n = $V;
                    }
                });
                if (this.length === 1) {
                    return $n;
                } else {
                    return j;
                }
            };
        })(jQuery);
    };
    (function registerAngularModule() {
        var $W = DayPilot.am();
        if (!$W) {
            return;
        };
        $W.directive("daypilotNavigator", function() {
            return {
                "restrict": "E",
                "template": "<div id='{{id}};'></div>",
                "compile": function compile(element, $X) {
                    element.replaceWith(this["template"].replace("{{id}};", $X["id"]));
                    return function link($Y, element, $X) {
                        var $b = new DayPilot.Navigator(element[0]);
                        $b.$0l.scope = $Y;
                        $b.init();
                        var $Z = $X["id"];
                        if ($Z) {
                            $Y[$Z] = $b;
                        };
                        var $00 = $Y["$watch"];
                        $00.call($Y, $X["daypilotConfig"], function($01) {
                            for (var name in $01) {
                                $b[name] = $01[name];
                            };
                            $b.update();
                        }, true);
                    };
                }
            };
        });
    })();
    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }
})();