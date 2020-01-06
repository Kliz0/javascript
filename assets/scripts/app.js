const ATTACK_VALUE = 10;
const STRONG_ATTACK,VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 17;

const MODE_ATTACK = 'ATTACK'; // Using these for easier checking.
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK ='PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt('Max Health for you and the monster', '100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if(isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
    alert('The value you chose was invalid so the health is the default: 100');
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };  
    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK, LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER'
            break; 
        case LOG_EVENT_MONSTER_ATTACK, LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER'
            break;
   
        default: 
            logEntry = {};

    }
    battleLog.push(logEntry);    
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    hasBonusLife = true;
    resetGame(chosenMaxLife);
}

function endRound() {
    if(currentMonsterHealth <= 0) {
        alert('You defeated the monster!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
            );
        reset();
    }
    const initialPlayerHealth = currentPlayerHealth;
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
        );

    if(currentPlayerHealth <= 0 && hasBonusLife) {
         hasBonusLife = false;
         removeBonusLife();
         currentPlayerHealth = initialPlayerHealth;
         alert('Your bonus life was consumed to save you this time!');
         setPlayerHealth(initialPlayerHealth);
        } else {
            alert('The monster defeated you!');
            writeToLog(
                LOG_EVENT_GAME_OVER,
                'MONSTER WON',
                currentMonsterHealth,
                currentPlayerHealth
                );
            reset();
        }
}


function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK
    ? LOG_EVENT_PLAYER_ATTACK
    : LOG_EVENT_PLAYER_STRONG_ATTACK;
 /*   if(mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    } */
    currentMonsterHealth -= maxDamage;
    writeToLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function attackHandler() {
    attackMonster('ATTACK');
}

function strongAttackHandler() {
    attackMonster('STRONG_ATTACK');
}

function healPlayerHandler() {
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}


attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);