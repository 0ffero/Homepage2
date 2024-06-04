const consts = {
    QUARTER: '¼',
    HALF: '½',
    THREEQUARTERS: '¾',

    dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    dayNamesLong: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],

    deductionRegex: /([0-9]{1,3})\T\ [A-Z]/g,

    convertPartHourToSymbol: (part)=> {
        checkType(part,'number') && (part*=1);

        switch (part) {
            case 0: return '';
            case 0.25: return consts.QUARTER; break;
            case 0.5: return consts.HALF; break;
            case 0.75: return consts.THREEQUARTERS; break;
            return false;
        }
    },

    convertFloatToHoursAndMinutes: (floatVar)=> {
        checkType(floatVar,'number') && (floatVar*=1);

        let hours = floatVar/1|0;
        let minutes = floatVar%1*60;

        return `${hours}h ${minutes.toString().padStart(2,'0')}m`;
    },

    getDayDelta(dayName) {
        let dNS = consts.dayNamesShort;
        if (!dNS.includes(dayName)) return false;

        let modDNS = [...consts.dayNamesShort];
        let sunday= modDNS.shift();
        modDNS.push(sunday);
        let index = modDNS.findIndex(d=>d===dayName); // this is actually the delta from monday!
        return index;
    },

    getDayNameFromInt(i) {
        if (i>6) return false;

        let dayNamesShort = consts.dayNamesShort;
        let dayNamesLong = consts.dayNamesLong;

        return { short: dayNamesShort[i], long: dayNamesLong[i] };
    }

};