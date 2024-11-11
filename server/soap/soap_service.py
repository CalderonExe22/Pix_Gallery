from zeep import Client, exceptions

def list_countries():
    """
    Llama al servicio web de países y devuelve una lista de diccionarios con
    el código ISO y el nombre de cada país.
    """
    try:
        client = Client('http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL')
        response = client.service.ListOfCountryNamesByName()
        countries = [{'codigo': country.sISOCode, 'nombre': country.sName} for country in response]
        return countries
    except exceptions.Error as e:
        print(f"Error al conectar con el servicio: {e}")
        return []