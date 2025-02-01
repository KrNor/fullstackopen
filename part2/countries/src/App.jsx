import { useState, useEffect } from "react";
import CountriyServices from "./services/countries";

const SingleCountry = (props) => {
  return <p>{props.ctrName}</p>;
};

const SingleCountryDetailed = (props) => {
  const flagFontH1Size = {
    margin: 0,
    fontSize: 200,
  }; // this putting and emoji into a h1 and resizing it works somehow
  return (
    <div>
      <h2>{props.ctrName}</h2>
      <p>the capital is: {props.ctrinfo.capital}</p>
      <p>the population is: {props.ctrinfo.population}</p>
      <div>
        the languages are:
        {Object.values(props.ctrinfo.languages).map((lang) => {
          return (
            <p key={lang}>
              <b>{lang}</b>
            </p>
          );
        })}
      </div>
      <p>the flag of {props.ctrName} is:</p>
      <h1 style={flagFontH1Size}>{props.ctrinfo.flag}</h1>
    </div>
  );
};

const MultipleCountries = (props) => {
  var temps = props.countries
    .filter((res) =>
      res.name.common.toLowerCase().includes(props.search.toLowerCase())
    )
    .map((ress) => ress.name.common);
  if (temps.length === 0) {
    return <p>no countries match your criteria</p>;
  } else if (temps.length === 1) {
    return (
      <SingleCountryDetailed
        key={temps[0]}
        ctrName={temps[0]}
        ctrinfo={
          props.countries.filter((res) =>
            res.name.common.toLowerCase().includes(props.search.toLowerCase())
          )[0]
        }
      />
    );
  } else if (temps.length > 11) {
    return <p>the current list is too long to show</p>;
  } else {
    return (
      <div>
        {temps.map((countryie) => (
          <SingleCountry key={countryie} ctrName={countryie} />
        ))}
      </div>
    );
  }
};

//   return (
//     <div>
//       {props.countries.map((res) => {
//         if (
//           res.name.common.toLowerCase().includes(props.search.toLowerCase())
//         ) {
//           return <p key={res.name.common}>{res.name.common}</p>;
//         }
//       })}
//     </div>
//   );
// };

const SearchField = (props) => {
  return (
    <p>
      find countries:
      <input onChange={props.onChange} value={props.value} />
    </p>
  );
};

function App() {
  const [searchQer, setSearchQer] = useState("");
  const [countries, setCountries] = useState([]);
  const [currCountries, setCurrCountries] = useState([]);

  useEffect(() => {
    CountriyServices.getAll().then((response) => {
      setCountries(response.data);
    });
  }, []);

  const onSearchChange = (event) => {
    setSearchQer(event.target.value);
  };

  return (
    <div>
      <SearchField onChange={onSearchChange} value={searchQer} />
      <MultipleCountries
        countries={countries}
        search={searchQer}
        setCurrCountries={() => setCurrCountries}
        currCountries={currCountries}
      />
    </div>
  );
}

export default App;
