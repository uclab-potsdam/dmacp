# dmacp

Tagging procedure and syntax.

## Standard and non standard OWL classes and properties
In general, we use for tagging this time specific ontology: https://www.w3.org/TR/2020/CR-owl-time-20200326/
We use a combination of standard and non-standard classes and properties to be able to encode causality between individual temporal entities.

## Markup via RDFa
We use RDFa to markup temporal information inside HTML content: https://www.w3.org/TR/rdfa-primer/
Where necessary, we deviate from standard RDFa to expedite the prototyping process.

## Prefixes and Namespaces
We use the following prefixes and namespaces:
|Prefix|Namespace|Comment|
|---|---|---|
|time|http://www.w3.org/2006/time#|OWL Time Ontology|
|rdfs|http://www.w3.org/2000/01/rdf-schema#|RDF Schema|
|ac|http://anthropocene-curriculum.org/tbd|Custom Vocabulary (doesn't exist yet)|

## Most important Classes and Properties

### Instant
Instant (temporal entity): A temporal entity with zero extent or duration. It marks something that happened, an event relevant for the narration. [standard]

```
<span resource="#i1" typeof="time:Instant">
    <meta property="time:inXSDgYear" content="-300" />
    <meta property="rdfs:label" content="300 BCE" />
    <meta property="ac:hasIndefiniteness" content="0.5" />
    Around 300 BCE, iron forges were at work from Cameroon to Ireland to Korea. 
</span>
```

#### Label → [time:Instant](https://www.w3.org/TR/2020/CR-owl-time-20200326/#time:Instant)
#### Properties →
- URI [standard]: unique identifier for the entity starts with i
- `time:inXSDYear` [standard]
    - Parameter: Number positive (CE) / negative (BCE) expressing where the instant is located in relation to others
- `rdfs:label` [standard]
    - Parameter: string of text with readable label that describes the entity
- `ac.hasConnection`[non standard]
    - Parameters: URI of another entity, string specifying the type of connection, float from 0 to 1 expressing the degree of connectedness. 0 means no connection, 1 means strong connection.
- `ac:hasIndefiniteness` [non standard]
    - Parameter: Float from 0 to 1 which expresses the degree of uncertainty connected to an instant or an interval. 0 has no uncertainty, 1 has uncertainty.

-----

### Interval
A temporal entity with non-zero extent or duration, i.e. for which the value of the beginning and end are different [standard]

```
<span resource="#d16" typeof="time:Interval">
    <span property="time:hasBeginning" typeof="time:Instant">
        <meta property="time:inXSDgYear" content="1750" />
        <meta property="rdfs:label" content="Mid Eighteenth Century" />
    </span>
    <span property="time:hasEnd" typeof="time:Instant">
        <meta property="time:inXSDgYear" content="1799" />
        <meta property="rdfs:label" content="End of Eighteenth Century" />
    </span>
    Coal became the primary fuel for industrial purposes following James Watt&rsquo;s developments of Thomas
    Newcomen&rsquo;s pumping engine in the UK in the late eighteenth century.
</span>
```

#### Label → [time:ProperInterval](https://www.w3.org/TR/2020/CR-owl-time-20200326/#time:ProperInterval)
#### Properties →
    - `URI` [standard]: unique identifier for the entity starts with d
- `hasBeginning` [standard]: 
    - Parameter: Reference to instant recognized as the beginning of the interval or an anonymous instant. See interval for all possible properties and parameters.
- `hasEnd` [standard]: 
    - Parameter: Reference to instant recognized as the end of the interval or an anonymous instant. See interval for all possible properties and parameters.
- `ac.hasConnection`[non standard]
    - Parameters: URI of another entity, string specifying the type of connection, float from 0 to 1 expressing the degree of connectedness. 0 means no connection, 1 means strong connection.
- `ac:hasIndefiniteness` [non standard]
    - Parameter: Float from 0 to 1 which expresses the degree of uncertainty connected to an instant or an interval. 0 has no uncertainty, 1 has uncertainty.
- time algebra properties [standard]: see [OWL Time](https://www.w3.org/TR/2020/CR-owl-time-20200326/#time:intervalAfter) §4.2.21 - §4.2.35
