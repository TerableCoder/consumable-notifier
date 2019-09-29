module.exports = function Notifyconsumexpiry(mod) {
    let activeConsumables = [];
    const Consumables = {
        4830: 'Bravery',	// Normal
        4833: 'Bravery',	// Strong
        4886: 'Bravery',	// Normal
        4953: 'Canephora',	// Normal
        4955: 'Canephora',	// Strong
        920:  'Noctenium',	// Uncommon
        921:  'Noctenium',	// Rare
        922:  'Noctenium',	// Superior
	};
    
    mod.game.on('enter_game', () => { activeConsumables = []; });
	mod.hook('S_ABNORMALITY_BEGIN', 3, UpdateConsumables);
	mod.hook('S_ABNORMALITY_REFRESH', 1, UpdateConsumables);
    function UpdateConsumables(event) {
		if(!mod.game.me.is(event.target)) return;
        let abnormality = activeConsumables.find(p => p.id == event.id);
        if(Consumables[event.id]){
            event.startTime = Date.now();
            if(abnormality){ 
                abnormality.startTime = event.startTime; 
                abnormality.duration = event.duration; 
            } else{ 
                activeConsumables.push(event);
            }
        }
    }
    
    mod.hook('S_ABNORMALITY_END', 1, (event) => {
		if(!mod.game.me.is(event.target)) return;
        let abnormality = activeConsumables.find(p => p.id == event.id);
        if(abnormality && Date.now() > abnormality.startTime + abnormality.duration - 1000){
            sendMessage(Consumables[event.id] + ' has expired.');
            activeConsumables = activeConsumables.filter(p => p.id != event.id);
        }
    })
    
    function sendMessage(msg){
        mod.command.message(msg);
        mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
            type: 42, // 42 Blue Shiny Text, 31 Normal Text
            chat: false, 
            channel: 27, 
            message: msg
		});         
    }
}
