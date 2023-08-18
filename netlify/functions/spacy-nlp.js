const { spawnSync } = require('child_process');
const striptags = require("striptags");
const nlp = require('compromise')

exports.handler = async function(event, context) {
    try {
        // define a list of stopwords to filter out
        const stopwords = ["a","a's","able","about","above","according","accordingly","across","actually","after","afterwards","again","against","ain't","all","allow","allows","almost","alone","along","already","also","although","always","am","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","around","as","aside","ask","asking","associated","at","available","away","awfully","b","be","became","because","become","becomes","becoming","been","before","beforehand","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by","c","c'mon","c's","came","can","can't","cannot","cant","cause","causes","certain","certainly","changes","clearly","co","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","course","currently","d","definitely","described","despite","did","didn't","different","do","does","doesn't","doing","don't","done","down","downwards","during","e","each","edu","eg","eight","either","else","elsewhere","enough","entirely","especially","et","etc","even","ever","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","f","far","few","fifth","first","five","followed","following","follows","for","former","formerly","forth","four","from","further","furthermore","g","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings","h","had","hadn't","happens","hardly","has","hasn't","have","haven't","having","he","he's","hello","help","hence","her","here","here's","hereafter","hereby","herein","hereupon","hers","herself","hi","him","himself","his","hither","hopefully","how","howbeit","however","i","i'd","i'll","i'm","i've","ie","if","ignored","immediate","in","inasmuch","inc","indeed","indicate","indicated","indicates","inner","insofar","instead","into","inward","is","isn't","it","it'd","it'll","it's","its","itself","j","just","k","keep","keeps","kept","know","known","knows","l","last","lately","later","latter","latterly","least","less","lest","let","let's","like","liked","likely","little","look","looking","looks","ltd","m","mainly","many","may","maybe","me","mean","meanwhile","merely","might","more","moreover","most","mostly","much","must","my","myself","n","name","namely","nd","near","nearly","necessary","need","needs","neither","never","nevertheless","new","next","nine","no","nobody","non","none","noone","nor","normally","not","nothing","novel","now","nowhere","o","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","only","onto","or","other","others","otherwise","ought","our","ours","ourselves","out","outside","over","overall","own","p","particular","particularly","per","perhaps","placed","please","plus","possible","presumably","probably","provides","q","que","quite","qv","r","rather","rd","re","really","reasonably","regarding","regardless","regards","relatively","respectively","right","s","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","she","should","shouldn't","since","six","so","some","somebody","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure","t","t's","take","taken","tell","tends","th","than","thank","thanks","thanx","that","that's","thats","the","their","theirs","them","themselves","then","thence","there","there's","thereafter","thereby","therefore","therein","theres","thereupon","these","they","they'd","they'll","they're","they've","think","third","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","to","together","too","took","toward","towards","tried","tries","truly","try","trying","twice","two","u","un","under","unfortunately","unless","unlikely","until","unto","up","upon","us","use","used","useful","uses","using","usually","uucp","v","value","various","very","via","viz","vs","w","want","wants","was","wasn't","way","we","we'd","we'll","we're","we've","welcome","well","went","were","weren't","what","what's","whatever","when","whence","whenever","where","where's","whereafter","whereas","whereby","wherein","whereupon","wherever","whether","which","while","whither","who","who's","whoever","whole","whom","whose","why","will","willing","wish","with","within","without","won't","wonder","would","wouldn't","x","y","yes","yet","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","z","zero"]

        // Parse data from the request body (assuming JSON data)
        const requestData = JSON.parse(event.body);
        const html = requestData.notes;
        let notesText = striptags(html)
        notesText = notesText.split('&nbsp;').join(' ')
        let textArr = notesText.split('\n').join('').split('(').join('').split(')').join('').split(' ') // remove new lines and parentheses
        
        // standardize the text
        textArr = textArr.map(word => word.toLowerCase())
        textArr = [...new Set(textArr)]
        const filtered = textArr.filter(word => !stopwords.includes(word))
        
        let doc = nlp(filtered.join(' '))
        const adjs = doc.adjectives().json()
        const nouns = doc.nouns().toSingular().json()
        let nounsArr = []
        let adjArr = []

        for (let noun of nouns) {
          nounsArr.push(noun.text)
        }

        for (let adj of adjs) {
          adjArr.push(adj.text)
        }

        nounsArr = nounsArr.join(' ').split(':').join(' ').split('.').join(' ').split(',').join('').split('-').join(' ').split(' ') // remove colons, periods, commas, and hyphens
        nounsArr = nounsArr.filter(noun => isNaN(Number(noun)))

        const words = [...new Set([...adjArr, ...nounsArr])]

        // Call the Python script and pass data as arguments
        // const pythonScriptPath = "C:/Users/athib/source/repos/goatnote/spacy-nlp.py";
        // const args = [pythonScriptPath, notesText];
    
        // const result = spawnSync("py", args);
        // const stdout = result.stdout.toString();
        // const stderr = result.stderr.toString();
    
        return {
          statusCode: 200,
          body: JSON.stringify({ result: words }),
        };
    } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error }),
        };
      }
}