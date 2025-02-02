import { useState, useEffect } from "react";
import CountriyServices from "./services/countries";

const SingleCountry = (props) => {
  return (
    <div>
      <p>
        {props.countryObject.name.common}{" "}
        <button
          onClick={() => {
            props.setSearchQerr(props.countryObject.name.common);
            props.setSelectedCountries([props.countryObject]);
          }}
        >
          show
        </button>
      </p>
    </div>
  );
};

const SingleCountryDetailed = (props) => {
  return (
    <div>
      <h2>{props.countryObject.name.common}</h2>
      <p>the capital is: {props.countryObject.capital}</p>
      <p>the population is: {props.countryObject.population}</p>
      <div>
        the languages are:
        {Object.values(props.countryObject.languages).map((lang) => {
          return (
            <p key={lang}>
              <b>{lang}</b>
            </p>
          );
        })}
      </div>
      <p>the flag of {props.countryObject.name.common} is:</p>
      <h1 className="h1offlag">{props.countryObject.flag}</h1>
    </div>
  );
};

const MultipleCountries = (props) => {
  if (props.selectCountries.length === 0) {
    return <p>no countries match your criteria</p>;
  } else if (props.selectCountries.length === 1) {
    return (
      <SingleCountryDetailed
        key={props.selectCountries[0].name.common}
        countryObject={props.selectCountries[0]}
      />
    );
  } else if (props.selectCountries.length > 10) {
    return <p>the current list is too long to show</p>;
  } else {
    return (
      <div>
        {props.selectCountries.map((countryie) => (
          <SingleCountry
            key={countryie.name.common}
            countryObject={countryie}
            setSearchQerr={props.setSearchQerr}
            setSelectedCountries={props.setSelectedCountries}
          />
        ))}
      </div>
    );
  }
};
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
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    CountriyServices.getAll().then((response) => {
      setCountries(response.data);
    });
  }, []);

  const onSearchChange = (event) => {
    setSearchQer(event.target.value);
    setSelectedCountries(
      countries.filter((res) =>
        res.name.common.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  };
  return (
    <div>
      <SearchField onChange={onSearchChange} value={searchQer} />
      <MultipleCountries
        selectCountries={selectedCountries}
        setSearchQerr={setSearchQer}
        setSelectedCountries={setSelectedCountries}
      />
    </div>
  );
}

export default App;
