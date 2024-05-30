import enum

# from databases import Database
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    Date,
    Time,
    JSON,
    create_engine,
    text,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.sql import func

DATABASE_URL = "mysql+pymysql://root:hi@127.0.0.1:3306/trustview"

engine = create_engine(DATABASE_URL, )

# create db if not exists
if not database_exists(engine.url):
    create_database(engine.url)

# create session for session connection
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    print("New session created")
    try:
        yield db
    finally:
        db.close()

def get_sqlalchemy_operator(operator_str):
    operator_map = {
        "eq": lambda field, value: field == value,
        "not": lambda field, value: field != value,
        "gt": lambda field, value: field > value,
        "gte": lambda field, value: field >= value,
        "lt": lambda field, value: field < value,
        "lte": lambda field, value: field <= value,
        "like": lambda field, value: field.like(value),
        # Add more operators as needed
    }

    return operator_map.get(operator_str)

class Client(Base):
    __tablename__ = "client"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    address = Column(Text)
    username = Column(String(64), nullable=False, unique=True)
    password = Column(Text, nullable=False)

    exams = relationship("Exam", back_populates="client",order_by="Exam.id")

class ExamTypeEnum(str, enum.Enum):
    live = "live"
    alpha = "alpha"
    beta = "beta"

class Exam(Base):
    __tablename__ = "exam"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client.id"), nullable=False,)
    name = Column(Text, nullable=False)
    code = Column(Text, nullable=False)
    post = Column(Text)
    type = Column(Enum(ExamTypeEnum), nullable=False)
    description = Column(Text, comment="Description for exam")

    instances = relationship("Instance", back_populates="exam",order_by="Instance.id")
    client = relationship("Client", back_populates="exams")
    client_name = association_proxy("client","name")
    shifts = relationship("Shift", back_populates="exam", order_by="Shift.date")

class Instance(Base):
    __tablename__ = "instance"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exam.id"), nullable=False,)
    key = Column(Text, nullable=False)

    exam = relationship("Exam", back_populates="instances")

class Shift(Base):
    __tablename__ = "shift"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exam.id"), nullable=False,)
    code = Column(Text, nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    exam = relationship("Exam", back_populates="shifts")    
    exam_name = association_proxy("exam","name")
    centers = relationship("Center", back_populates="shift")        

class Center(Base):
    __tablename__ = "center"

    id = Column(Integer, primary_key=True, index=True)
    shift_id = Column(Integer, ForeignKey("shift.id"), nullable=False,)
    code = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    location = Column(Text, nullable=False)

    shift = relationship("Shift", back_populates="centers")    
    cameras = relationship("Camera", back_populates="center")    

class Camera(Base):
    __tablename__ = "camera"

    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("center.id"), nullable=False,)
    name = Column(Text, nullable=False)
    sublocation = Column(Text, nullable=False)
    dss_id = Column(Integer, nullable=False)
    dss_channel = Column(Integer, nullable=False)

    center = relationship("Center", back_populates="cameras") 
    features = relationship("Feature", back_populates="camera") 

class Feature(Base):
    __tablename__ = "feature"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("camera.id"), nullable=False,)
    name = Column(Text, nullable=False)
    json = Column(Text, nullable=False)

    camera = relationship("Camera", back_populates="features")       
    roi = relationship("Roi", back_populates="feature")       

class RoiTypeEnum(str, enum.Enum):
    pending = "pending"
    marked = "marked"
    approved = "approved"
    rejected = "rejected"

class Roi(Base):
    __tablename__ = "roi"

    id = Column(Integer, primary_key=True, index=True)
    feature_id = Column(Integer, ForeignKey("feature.id"), nullable=False,)
    name = Column(Text, nullable=False)
    comment = Column(Text)
    json = Column(Text, nullable=False)
    status = Column(Enum(RoiTypeEnum), nullable=False, server_default=RoiTypeEnum.pending)
    last_updated = Column(DateTime, nullable=False, server_default=func.now(), server_onupdate=func.now())

    feature = relationship("Feature", back_populates="roi")     

# class AlertTypeEnum(str, enum.Enum):
#     supressed = '0'
#     active = '1'

class Alert(Base):
    __tablename__ = "alert"

    id = Column(Integer, primary_key=True, index=True)
    feature = Column(Text, nullable=False)
    exam = Column(Text, nullable=False)
    shift = Column(Text, nullable=False)
    center = Column(Text, nullable=False)
    location = Column(Text, nullable=False)
    camera = Column(Text, nullable=False)
    sublocation = Column(Text)
    timestamp = Column(DateTime, nullable=False, server_default=func.now())
    # status = Column(Enum(AlertTypeEnum), nullable=True, server_default=AlertTypeEnum.active)
    image_path = Column(Text, nullable=False)
    video_path = Column(Text, nullable=False)

    activity = relationship("AlertActivity", back_populates="alert")  
    ticket = relationship("Ticket", back_populates="alert")  


class AlertActivityStatusEnum(str, enum.Enum):
    true = 'true'
    false = 'false'

class AlertActivity(Base):
    __tablename__ = "alert_activity"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alert.id"), nullable=False,)
    # to be done
    # user_id = Column(Integer, ForeignKey("user.id"), nullable=False,)
    comment = Column(Text, nullable=True)
    status = Column(Enum(AlertActivityStatusEnum), nullable=True)
    last_updated = Column(DateTime, nullable=True, server_default=func.now(), server_onupdate=func.now())

    alert = relationship("Alert", back_populates="activity")       

class Ticket(Base):
    __tablename__ = "ticket"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alert.id"), nullable=False,)
    camera = Column(Text, nullable=False)
    feature = Column(Text, nullable=False)
    sublocation = Column(Text, nullable=False)

    activity = relationship("TicketActivity", back_populates="ticket",order_by="desc(TicketActivity.id)")     
    alert =   relationship("Alert", back_populates="ticket")

class TicketActivityStatusEnum(str, enum.Enum):
    new = 'new'
    open = 'open'
    resolved = 'resolved'

class TicketActivity(Base):
    __tablename__ = "ticket_activity"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("ticket.id"), nullable=False,)
    # to be done
    # user_id = Column(Integer, ForeignKey("user.id"), nullable=False,)
    status = Column(Enum(TicketActivityStatusEnum), nullable=False,server_default=TicketActivityStatusEnum.new)
    comment = Column(Text, nullable=True)
    last_updated = Column(DateTime, nullable=True, server_default=func.now(), server_onupdate=func.now())    

    ticket = relationship("Ticket", back_populates="activity")       

Base.metadata.create_all(engine)


# class Blockchain(Base):
#     __tablename__ = "blockchain"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(45), nullable=False)
#     description = Column(Text)
#     icon = Column(Text)
#     status = Column(Enum(StatusEnum))
#     sustainability_score = Column(Integer)
#     decentralization_score = Column(Integer)
#     available = Column(Boolean, default=True)

#     categories = relationship("Category", secondary="BlockchainCategory", back_populates="blockchains")
#     starting_price = relationship(
#         "StartingPrice", cascade="all, delete", uselist=True
#     )
#     protocols = relationship("Protocol", secondary="BlockchainProtocol", back_populates="blockchains")
#     deployments = relationship("Deployment", secondary="BlockchainDeployment", back_populates="blockchains")


# class StartingPrice(Base):
#     __tablename__ = "starting_price"

#     id = Column(Integer, primary_key=True, index=True)
#     currency = Column(String(45), nullable=False)
#     currency_icon = Column(Text)
#     value = Column(Float, nullable=False)
#     blockchain_id = Column(Integer, ForeignKey("blockchain.id"), nullable=False)


# class Category(Base):
#     __tablename__ = "category"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(45), nullable=False)
#     icon = Column(Text)

#     blockchains = relationship("Blockchain", secondary="BlockchainCategory", back_populates="categories")


# BlockchainCategory = Table(
#     "BlockchainCategory",
#     Base.metadata,
#     Column("blockchain_id", Integer, ForeignKey("blockchain.id")),
#     Column("category_id", Integer, ForeignKey("category.id")),
# )


# class Protocol(Base):
#     __tablename__ = "protocol"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(45), nullable=False)
#     description = Column(Text)

#     blockchains = relationship("Blockchain", secondary="BlockchainProtocol", back_populates="protocols")


# BlockchainProtocol = Table(
#     "BlockchainProtocol",
#     Base.metadata,
#     Column("id", Integer, primary_key=True, index=True),
#     Column("blockchain_id", Integer, ForeignKey("blockchain.id")),
#     Column("protocol_id", Integer, ForeignKey("protocol.id")),
# )


# class Deployment(Base):
#     __tablename__ = "deployment"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(45), nullable=False)
#     description = Column(Text)

#     blockchains = relationship("Blockchain", secondary="BlockchainDeployment", back_populates="deployments")


# BlockchainDeployment = Table(
#     "BlockchainDeployment",
#     Base.metadata,
#     Column("id", Integer, primary_key=True, index=True),
#     Column("blockchain_id", Integer, ForeignKey("blockchain.id")),
#     Column("deployment_id", Integer, ForeignKey("deployment.id")),
# )


# class TypeEnum(enum.Enum):
#     server = "Server"
#     deployment = "Deployment"


# class Service(Base):
#     __tablename__ = "service"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     type = Column(Enum(TypeEnum))
#     name = Column(String(45), nullable=False)
#     billing_cycle = Column(Integer, nullable=False)
#     currency = Column(String(45), nullable=False)
#     currency_icon = Column(Text)
#     value = Column(Float, nullable=False)

#     blockchain_service = relationship("BlockchainService", backref="service", cascade="all, delete")
#     server_site_price = relationship(
#         "ServerService", backref="service", cascade="all, delete", uselist=True
#     )
#     purchase_service = relationship(
#         "PurchaseService", backref="service", cascade="all, delete", uselist=True
#     )


# class BlockchainService(Base):
#     __tablename__ = "blockchain_service"

#     id = Column(Integer, primary_key=True, index=True)
#     blockchain_id = Column(Integer, ForeignKey("blockchain.id"), nullable=False)
#     protocol_id = Column(Integer, ForeignKey("protocol.id"), nullable=False)
#     service_id = Column(Integer, ForeignKey("service.id"), nullable=False)
#     deployment_id = Column(Integer, ForeignKey("deployment.id"), nullable=False)


# class Server(Base):
#     __tablename__ = "server"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     name = Column(String(45), nullable=False)
#     available = Column(Boolean, default=True)
#     recommended = Column(Boolean, default=True)

#     sites = relationship("Site", secondary="ServerSites", back_populates="servers")
#     types = relationship("Type", secondary="ServerType", back_populates="servers")


# class Site(Base):
#     __tablename__ = "site"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     address = Column(Text, nullable=False)
#     location = Column(Text, nullable=False)
#     available = Column(Boolean, default=True)
#     recommended = Column(Boolean, default=True)

#     servers = relationship("Server", secondary="ServerSites", back_populates="sites")


# class ServerService(Base):
#     __tablename__ = "server_service"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     server_id = Column(Integer, ForeignKey("server.id"), nullable=False)
#     site_id = Column(Integer, ForeignKey("site.id"), nullable=False)
#     service_id = Column(Integer, ForeignKey("service.id"), nullable=False)


# ServerSites = Table(
#     "ServerSites",
#     Base.metadata,
#     Column("id", Integer, primary_key=True, index=True),
#     Column("site_id", Integer, ForeignKey("site.id")),
#     Column("server_id", Integer, ForeignKey("server.id")),
# )

# class ServerSpecification(Base):
#     __tablename__ = "server_specification"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     spec_dict = Column(Text, nullable=False)
#     server_id = Column(Integer, ForeignKey("server.id"), nullable=False)
   

# ServerType = Table(
#     "ServerType",
#     Base.metadata,
#     Column("type_id", Integer, ForeignKey("type.id")),
#     Column("server_id", Integer, ForeignKey("server.id")),
# )
# class Type(Base):
#     __tablename__ = "type"
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(45), nullable=False)
#     description = Column(Text)
#     servers = relationship("Server", secondary="ServerType", back_populates="types")



# class ServerSite(Base):
#     __tablename__ = "server_site"

#     id = Column(Integer, primary_key=True, index=True)
#     site_id = Column(Integer, ForeignKey("site.id"), nullable=False)
#     server_id = Column(Integer, ForeignKey("server.id"), nullable=False)


# class User(Base):
#     __tablename__ = "user"

#     id = Column(Integer, primary_key=True, index=True)
#     whmcs_id = Column(Integer)
#     username = Column(String(45), nullable=False)
#     firstname = Column(String(45))
#     lastname = Column(String(45))
#     email = Column(String(256), nullable=False)

#     purchases = relationship("Purchase", backref="user", cascade="all, delete")


# class Purchase(Base):
#     __tablename__ = "purchase"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(45), nullable=False)
#     billing_cycle = Column(Integer)
#     user_id = Column(Integer, ForeignKey("user.id"), nullable=False)

#     purchase_service = relationship(
#         "PurchaseService", backref="purchase", cascade="all, delete", uselist=False
#     )
#     subscription = relationship(
#         "Subscription", backref="purchase", cascade="all, delete", uselist=False
#     )


# class PurchaseService(Base):
#     __tablename__ = "purchase_service"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(45), nullable=False)
#     purchase_id = Column(Integer, ForeignKey("purchase.id"), nullable=False)
#     service_id = Column(Integer, ForeignKey("service.id"), nullable=False)


# class Subscription(Base):
#     __tablename__ = "subscription"

#     id = Column(Integer, primary_key=True, index=True)
#     start_date = Column(DateTime)
#     end_date = Column(DateTime)
#     purchase_id = Column(Integer, ForeignKey("purchase.id"), nullable=False)