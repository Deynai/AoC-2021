module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput = '';

    day.setup = function(){
        let toBinary = {
            "0" : "0000", "1" : "0001", "2" : "0010", "3" : "0011", "4" : "0100", "5" : "0101", "6" : "0110", "7" : "0111",
            "8" : "1000", "9" : "1001", "A" : "1010", "B" : "1011", "C" : "1100", "D" : "1101", "E" : "1110", "F" : "1111"
        }

        parsedInput = input.trim().split("").map(x => { return toBinary[x]; }).join("");
    }

    function constructPackets(inputText){
        let data = inputText;
        let state = { index : 0 };
        let packet = parsePacket(data, state);

        return packet;
    }

    function parsePacket(data, state){
        let version = parseInt(data.substring(state.index, state.index += 3), 2);
        let type = parseInt(data.substring(state.index, state.index += 3), 2);

        let value;

        if (type === 4){
            value = parseNumber(data, state);
        }
        else{
            value = parseOperation(data, state);
        }

        return {
            "version" : version,
            "type" : type,
            "value" : value
        }
    }

    function parseNumber(data, state){
        let numbers = [];

        while (data[state.index] === "1"){
            numbers.push(data.substring(state.index + 1, state.index += 5));
        } 
        // finally:
        numbers.push(data.substring(state.index + 1, state.index += 5));

        return parseInt(numbers.join(""), 2);
    }

    function parseOperation(data, state){
        let value = [];
        let lengthTypeID = data[state.index++];

        if (lengthTypeID === "0"){
            let numberOfBits = parseInt(data.substring(state.index, state.index += 15), 2);
            
            let maxIndex = state.index + numberOfBits;
            while (state.index < maxIndex){
                value.push(parsePacket(data, state));
            }
        }
        else{
            let numberOfPackets = parseInt(data.substring(state.index, state.index += 11), 2);

            for (let i = 0; i < numberOfPackets; i++){
                value.push(parsePacket(data, state));
            }
        }

        return value;
    }

    day.partOne = function(){
        packet = constructPackets(parsedInput);
        console.log(countVersions(packet));
    }

    day.partTwo = function(){
        packet = constructPackets(parsedInput);
        console.log(performOp(packet));
    }
    
    function countVersions(packet){
        if (!isNaN(packet.value)){
            return packet.version;
        }
        
        return packet.value.reduce((a, b) => a + countVersions(b), 0) + packet.version;
    }

    function performOp(packet){
        switch (packet.type) {
            case 0:
                return sumPacket(packet);
            case 1:
                return productPacket(packet);
            case 2:
                return minPacket(packet);
            case 3:
                return maxPacket(packet);
            case 4:
                return packet.value;
            case 5:
                return gtPacket(packet);
            case 6:
                return ltPacket(packet);
            case 7:
                return eqPacket(packet);
            default:
                console.log(`Invalid packet type for recursion: ${packet.type}`);
        }

        function sumPacket(packet){
            return packet.value.reduce((a, b) => a + performOp(b), 0);
        }
    
        function productPacket(packet){
            return packet.value.reduce((a, b) => a * performOp(b), 1);
        }
    
        function minPacket(packet){
            return Math.min(...packet.value.map(a => performOp(a)));
        }
    
        function maxPacket(packet){
            return Math.max(...packet.value.map(a => performOp(a)));
        }
    
        function gtPacket(packet){
            return performOp(packet.value[0]) > performOp(packet.value[1]) ? 1 : 0;
        }
    
        function ltPacket(packet){
            return performOp(packet.value[0]) < performOp(packet.value[1]) ? 1 : 0;
        }
    
        function eqPacket(packet){
            return performOp(packet.value[0]) === performOp(packet.value[1]) ? 1 : 0;
        }
    }

    return day;
}