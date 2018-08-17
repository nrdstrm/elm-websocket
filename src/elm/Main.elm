module Main exposing (Model, Msg, update, view, subscriptions, init)

import Html exposing (Html, div, input, button, text)
import Html.Events exposing (onInput, onClick)
import Html.Attributes exposing (value)
import WebSocket


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { title : String
    , message : String
    , messages : List String
    , server : { url : String }
    }


init : ( Model, Cmd Msg )
init =
    ( { title = ""
      , message = ""
      , messages = []
      , server =
            { url = "ws://localhost:3000/server"
            }
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = Input String
    | SendMessage
    | NewMessage String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Input message ->
            ( { model | message = message }, Cmd.none )

        SendMessage ->
            ( { model | message = "" }, WebSocket.send model.server.url model.message )

        NewMessage message ->
            ( { model | messages = (message :: model.messages) }, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    WebSocket.listen model.server.url NewMessage



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ input [ value model.message, onInput Input ] []
        , button [ onClick SendMessage ] [ text "Send message" ]
        , renderMessages model.messages
        ]


renderMessages : List String -> Html Msg
renderMessages messages =
    div []
        (List.map (\x -> div [] [ text x ]) messages)
