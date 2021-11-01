# dmacp

Tagging procedure and synthax.

## Standard and non standard OWL classes and properties
In general, we use for tagging this time specific ontology: https://www.w3.org/TR/2020/CR-owl-time-20200326/
We use a combination of standard and non-standard classes to be able to encode causality within individual temporal entities.
So far we consider a narration an ensable of time entities. An essay can have multiple narration and one narration can have several temporal entities.

-----

## Narration(s)
A narration is a portion of the essay which has variable length. Usually we mark a paragraph as a narration unit. By having multiple narrations within an essay we can construct a TRS local to itself. We still don't know how to relate this local TRS with the standard temporal axis.

-----


## Difference between Instant and Interval

### Instant
Instant (temporal entity): A temporal entity with zero extent or duration. It marks something that happened, an event relevant for the narration. [standard]

```
<span resource="#i9" typeof="time:Instant">
    <meta property="time:inXSDgYear" content="-300" />
    <meta property="rdfs:label" content="300 BCE" />
    By 300 BCE, iron forges were at work from Cameroon to Ireland to Korea. 
</span>
```

#### Label → [time:Instant](https://www.w3.org/TR/2020/CR-owl-time-20200326/#time:Instant)
#### Properties →
- URI [standard]: unique identifier for the entity starts with i
- `inTimePosition` (inXSDYear?) [standard]
    - Parameter: Number positive (CE) / negative (BCE) expressing where the instant is located in relation to others
- `inXSDDate`: [standard]
    - Parameter: Gregorian calendar date e.g. 2021-10-20.
- `hasDescription` / hasLabel [non standard]
    - Parameter: string of text with readable label that describes the entity
- `inRelationTo`[non standard]
    - Parameter: URI of another interval / instant the current entity is related to.
- `Uncertain` [non standard]
    - Parameter: Float from 0 to 1 which expresses the degree of uncertainty connected to an instant or an interval. 0 has no uncertainty, 1 has uncertainty.

-----

### Interval


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