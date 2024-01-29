import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import yen from "../../../assets/icons/yen-symbol.png";
import dolar from "../../../assets/icons/dollar.png";
import pound from "../../../assets/icons/pound-symbol-variant.png";

interface Rates {
  rates: {
    USD: number;
    CNY: number;
    JPY: number;
    GBP: number;
    HKD: number;
    INR: number;
    KRW: number;
    AUD: number;
    CAD: number;
    CHR: number;
    BRL: number;
    NOK: number;
    SEK: number;
    TRY: number;
    DKK: number;
    CZK: number;
    HUF: number;
  };
}

export const CoinConversor = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<
    Rates["rates"] | undefined
  >();
  const [convertedAmount, setConvertedAmount] = useState<number>();

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const fetchRateExchange = useCallback(async () => {
    const api = "api.frankfurter.app";
    const url = `https://${api}/latest?from=EUR&to=USD,CNY,JPY,GBP,HKD,INR,KRW,AUD,CAD,CHR,BRL,NOK,TRY,SEK,DKK,CZK,HUF`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Algo ha ido mal");
      }
      const responseJson: Rates = await response.json();
      const newExchangeRate = responseJson.rates;
      setExchangeRate(newExchangeRate);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }, []);

  useEffect(() => {
    fetchRateExchange();
  }, []);

  const handleAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleConversion = (conversionType: string): void => {
    if (exchangeRate) {
      let fConversion;
      switch (selectedOption) {
        case "JPY":
          fConversion = exchangeRate.JPY;
          break;
        case "USD":
          fConversion = exchangeRate.USD;
          break;
        case "GBP":
          fConversion = exchangeRate.GBP;
          break;
        case "CNY":
          fConversion = exchangeRate.CNY;
          break;
        case "HKD":
          fConversion = exchangeRate.HKD;
          break;
        case "KRW":
          fConversion = exchangeRate.KRW;
          break;
        case "AUD":
          fConversion = exchangeRate.AUD;
          break;
        case "CAD":
          fConversion = exchangeRate.CAD;
          break;
        case "INR":
          fConversion = exchangeRate.INR;
          break;
        case "CHF":
          fConversion = exchangeRate.CHR;
          break;
        case "BRL":
          fConversion = exchangeRate.BRL;
          break;
        case "DKK":
          fConversion = exchangeRate.DKK;
          break;
        case "TRY":
          fConversion = exchangeRate.TRY;
          break;
        case "SEK":
          fConversion = exchangeRate.SEK;
          break;
        case "HUF":
          fConversion = exchangeRate.HUF;
          break;
        case "CZK":
          fConversion = exchangeRate.CZK;
          break;
        case "NOK":
          fConversion = exchangeRate.NOK;
          break;
      }
      const cantidad: number =
        conversionType === "From"
          ? Number(amount) * Number(fConversion)
          : Number(amount) / Number(fConversion);
      setConvertedAmount(Number(cantidad.toFixed(2)));
    }
  };

  return (
    <div className=" ">
      <div className="card">
        <div className="card-body ">
          <div className="form-check">
            <select
              className="form-select form-select-sm"
              placeholder="Selecciona moneda"
              aria-label="Default select example"
              onChange={handleChangeSelect}
              value={selectedOption}
            >
              <option value="">Selecciona una moneda</option>
              <option value="JPY">Yen japonés</option>
              <option value="USD">Dólar</option>
              <option value="GBP">Libra esterlina</option>
              <option value="CNY">Yuan chino</option>
              <option value="INR">Rupia india</option>
              <option value="CAD">Dólar canadiense</option>
              <option value="AUD">Dolar australiano</option>
              <option value="KRW">Won surcoreano</option>
              <option value="HKD">Dólar hongkones</option>
              <option value="DKK">Corona danesa</option>
              <option value="BRL">Real brasileño</option>
              <option value="TRY">Lira turca</option>
              <option value="SEK">Corona sueca</option>
              <option value="NOK">Corona noruega</option>
              <option value="CZK">Corona checa</option>
              <option value="CHR">Franco suizo</option>
            </select>

            <div>
              <input
                type="number"
                id="amount"
                className="form-control mt-3"
                placeholder="Cantidad"
                onChange={handleAmount}
              />
              <input
                type="number"
                id="convertedAmount"
                value={convertedAmount?.toString()}
                className="form-control"
                disabled
                placeholder="Cantidad convertida"
              />
            </div>
            <div className="justify-content-center align-items-right mt-3">
              <button
                className="btn btn-primary btn-sm "
                id="euro"
                onClick={() => handleConversion("To")}
              >
                A €
              </button>
              <button
                className="btn btn-success btn-sm ms-2"
                id="other"
                onClick={() => handleConversion("From")}
              >
                Desde €
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
